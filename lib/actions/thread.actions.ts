"use server"

import { revalidatePath } from "next/cache"
import Thread from "../models/thread.model"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"

interface Params {
  text: string,
  author: string,
  communityId: string | null,
  path: string
}

export async function createThread({
  text, author, communityId, path
}:Params) {
  connectToDB() 

  try {

    const createdThread = await Thread.create({
      text,
      author,
      community: null
    })

    //update user model
    await User.findByIdAndUpdate(author, {
      $push: {threads: createdThread._id}
    })

    revalidatePath(path)

  } catch (error:any) {
    throw new Error(`Error while creating thread! : ${error.message}`)
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB()
  try {

    //calculate page number for pagination
    const skipAmount = (pageNumber - 1) * pageSize

    // find the posts with no parents because these are the top level threads
    const result = Thread
    .find({ parentId: {$in: [null, undefined]} })
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: 'author', model: User })
    .populate({ 
      path: 'children',
      populate: {
        path: 'author',
        model: User,
        select: '_id name parentId image'
      } 
    })

    // the count should also be of the threads with no parents
    const totalCount = await Thread.countDocuments({parentId: {$in: [null, undefined]}})

    const posts = await result.exec()

    const isNext = totalCount > skipAmount + posts.length

    return {posts, isNext}

  } catch (error:any) {
    throw new Error(`Failed to fetch thread: ${error?.message}`)
  }
}

export async function fetchThreadById(id:string) {
  connectToDB()

  try {

    //TODO : populate community later on
    const thread = await Thread.findById(id)
      .populate({
        path: 'author',
        model: User,
        select: '_id id name image'
      })
      .populate({
        path: 'children',
        populate: [
          {
            path: 'author',
            model: User,
            select: '_id id parentId image'
          },
          {
            path: 'children',
            model: Thread,
            populate: {
              path: 'author',
              model: User,
              select: '_id id name parentId image'
            }
          }
        ]
      }).exec()
    return thread
  } catch (error:any) {
    console.log('Failed to fetch thread details :', error?.message)
  }
}