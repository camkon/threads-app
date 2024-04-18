import ThreadCard from "@/components/cards/ThreadCard";
import UserCard from "@/components/cards/UserCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from '@clerk/nextjs'
import { redirect } from "next/navigation";

const Page = async () => {

  const user = await currentUser()
  if(!user) return null

  const userInfo = await fetchUser(user.id)
  if(!userInfo?.onboarded) redirect('/onboarding')

  const result = await fetchUsers({
    userId: user.id,
    searchString: '',
    pageSize: 20,
    pageNumber: 1
  })

  return(
    <section>
      <h1 className="head-text text-left">Search</h1>
      {/* search bar */}
      <div className="mt-14 flex flex-col gap-9">
        {result?.users?.length === 0 
          ? <p className="no-result">No users</p>
          : (
            <>{result?.users?.map((person:any) => (
              <UserCard
                key={person.id}
                id={person.id}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
                personType={'User'}
              />
            ))}</>
          )
        }
      </div>
    </section>
  )
}

export default Page