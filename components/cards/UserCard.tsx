"use client"

import Image from "next/image"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

interface Props {
  id: string,
  username: string,
  name: string,
  imgUrl: string,
  personType: string,
}

const UserCard = ({id, username, name, imgUrl, personType}:Props) => {

  const router = useRouter()

  return (
    <article className="user-card">
      <div className="user-card_avatar">
        <Image 
          src={imgUrl}
          alt={username}
          width={48}
          height={48}
          className="rounded-full"
        />

        <div className="flex-1 text-ellipsis">
          <h4 className="text-light-1 text-base-semibold">{name}</h4>
          <h4 className="text-gray-1 text-small-medium">@{username}</h4>
        </div>
      </div>

      <Button onClick={() => router.push(`/profile/${id}`)} className="user-card_btn">View</Button>
    </article>
  )
}

export default UserCard
