import AccountProfile from "@/components/forms/AccountProfile"
import { currentUser } from '@clerk/nextjs'

interface IUser {
	id: string,
	objectId: string,
	username: string,
	name: string,
	bio: string,
	image: string
}

interface IUserInfo {
	_id: string,
	username: string,
	name: string,
	bio: string,
	image: string
}

async function Page() {

	const user = await currentUser()

	const userInfo: IUserInfo = {
		_id: "",
		username: "",
		name: "",
		bio: "",
		image: ""
	}

	const userData = {
		id: user?.id,
		objectId: userInfo?._id,
		username: userInfo?.username || user?.username,
		name: userInfo?.name || user?.firstName || "",
		bio: userInfo?.bio || "",
		image: userInfo?.image || user?.imageUrl,
	}

	return(
		<main className="mx-auto flex max-w-3xl flex-col justify-start align-middle px-10 py-20">
			<h1 className="head-text">Onboarding</h1>
			<p className="mt-3 text-base-regular text-light-2">Complete your profile now</p>
		
			<section className="mt-9 bg-dark-2 p-10">
				<AccountProfile 
					user={userData} 
					buttonTitle="Continue"
				/>
			</section>
		</main>
	)
}

export default Page