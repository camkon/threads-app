import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(params?.id)

  return(
    <section>
      <ProfileHeader 
        accountId={userInfo?.id}
        authUserId={user?.id}
        name={userInfo?.name}
        username={userInfo?.username}
        imgUrl={userInfo?.image}
        bio={userInfo?.bio}
      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab:any) => (
              <TabsTrigger value={tab.value} key={tab.label} className="tab">
                <Image src={tab.icon} alt={tab.label} height={24} width={24} className="object-contain"/>
                <p className="max-sm:hidden">{tab.label}</p>
                {tab.label === "Threads" && (
                  <div className="ml-1 text-light-2 px-2 py-1 rounded-full !text-tiny-medium bg-light-4">{userInfo?.threads?.length}</div>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab:any) => (
            <TabsContent key={`content-${tab.label}`} value={tab.value} className="w-full text-light-1">
              <ThreadsTab
                accountId={userInfo?.id}
                currentUserId={user?.id}
                accountType={'User'}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default Page;
