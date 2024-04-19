import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from '@clerk/nextjs'
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = async () => {

  const user = await currentUser()
  if(!user) return null

  const userInfo = await fetchUser(user.id)
  if(!userInfo?.onboarded) redirect('/onboarding')

  const activity = await getActivity(userInfo._id)

  return(
    <section>
      <h1 className="head-text text-left">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activity?.length > 0 ? (
          <>
            {activity?.map((act:any) => (
              <Link href={`/thread/${act?.parentId}`} key={act?._id}>
                <article className="activity-card hover:bg-gray-900">
                  <Image src={act?.author.image} alt={act?.author.name} width={20} height={20} className="rounded-full object-cover"/>
                  <p className="text-light-1 !text-small-regular">
                    <span className="mr-1 text-primary-500">{act.author.name}</span>
                    replied to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        ):(
          <p className="text-light-3 !text-base-regular">No activity found!</p>
        )}
      </section>
    </section>
  )
}

export default Page