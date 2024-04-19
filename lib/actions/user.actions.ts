"use server"

import { connectToDB } from "@/lib/mongoose"
import User from "../models/user.model"
import { revalidatePath } from "next/cache"
import { AnyARecord } from "dns"
import Thread from "../models/thread.model"
import { FilterQuery, SortOrder } from "mongoose"

interface Params {
  userId: string,
  username: string,
  name: string,
  bio: string,
  image: string,
  path: string,    
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path
}: Params): Promise<void> {
  connectToDB()

  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true
      },
      { upsert: true }
    )
   
    if(path === '/profile/edit') {
      revalidatePath(path)
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`)
  }
}

export async function fetchUser(userId:string) {
  connectToDB()
  try {
    return await User
    .findOne({id: userId})
    // .populate({
    //   path: "communities",
    //   model: Community
    // })
  } catch (error:any) {
    throw new Error(`Failed to fetch user: ${error?.message}`)
  }
}

export async function fetchUserPosts(userId:string) {
  connectToDB()
  try {

    // TODO : Populate community
    const threads = await User.findOne({id: userId})
      .populate({
        path: 'threads',
        model: Thread,
        populate: {
          path: 'children',
          model: Thread,
          populate: {
            path: 'author',
            model: User,
            select: 'name image id'
          }
        }
      })
      return threads
  } catch (error:any) {
    console.log(`Error while fetching user posts : ${error?.message}`)
  }
}

export async function fetchUsers(
  {
    userId, 
    searchString = "", 
    pageSize = 1, 
    pageNumber = 20,
    sortBy = "desc"
  }:
  {
    userId: string, 
    searchString?: string,
    pageSize?: number,
    pageNumber?: number,
    sortBy?: SortOrder,
  }) {
  connectToDB()
  try {

    const skipAmount = (pageNumber - 1) * pageSize
    
    const regex = new RegExp(searchString, "i")

    const query: FilterQuery<typeof User> = {
      id: {$ne: userId}
    }

    if(searchString.trim() !== '') {
      query.$or = [
        {username : {$regex : regex}},
        {name : {$regex : regex}},
      ]
    }

    const sortOptions = {createdAt: sortBy}

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalCount = await User.countDocuments(query)

    const users = await usersQuery.exec();

    const isNext = totalCount > skipAmount + users.length;

    return {users, isNext}

  } catch (error:any) {
    console.log(`Error while fetching users : ${error?.message}`)
  }
}

export async function getActivity(userId:string) {
  try {
    connectToDB()

    const userThreads = await Thread.find({ author: userId })

    const childThreadIds = userThreads.reduce((accumilator, userThread) => {
      return accumilator.concat(userThread.children)
    }, [])

    const replies = await Thread.find({
      _id: {$in: childThreadIds},
      author: {$ne: userId},
    }).populate({
      path: 'author',
      model: User,
      select: 'name image _id'
    })

    return replies

  } catch (error:any) {
    console.log(`Error while fetching users : ${error?.message}`)
  }
  
}