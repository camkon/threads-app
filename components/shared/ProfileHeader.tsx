import Image from "next/image";

interface Props {
  accountId: string;
  authUserId: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
}

const ProfileHeader = ({
  accountId,
  authUserId,
  name,
  username,
  imgUrl,
  bio,
}: Props) => {
  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-20 object-cover">
            <Image src={imgUrl} alt={name} height={100} width={100} className="rounded-full object-cover shadow-2xl" />
          </div>

          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-light-1">{name}</h2>
            <p className="text-base-medium text-gray-1">@{username}</p>
          </div>
        </div>

        {/* TODO : Community */}

      </div>
      <p className="text-light-1 max-w-lg mt-6 text-base-regular">{bio}</p>
      <div className="bg-dark-3 w-full mt-6 h-0.5"/>
    </div>
  );
};

export default ProfileHeader;
