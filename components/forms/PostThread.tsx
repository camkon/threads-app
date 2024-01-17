"use client"

import React from "react"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { usePathname, useRouter } from "next/navigation"
import { ThreadValidation } from "@/lib/validations/thread"
import { createThread } from "@/lib/actions/thread.actions"

interface Props {
  user: {
    id: string,
		objectId: string,
		username: string,
		name: string,
		bio: string,
		image: string
  },
  buttonTitle: string
}

const PostThread = ({userId}:{userId: string|any}) => {

  const router = useRouter()
  const pathname = usePathname()

  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      accountId: userId
    },
  })

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    await createThread({
      text: values.thread,
      author: values.accountId,
      communityId: null,
      path: pathname
    })

    router.push("/")
  }

  return(
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="flex flex-col justify-start gap-10 mt-10"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea 
                  placeholder="Whats on your mind!?"
                  rows={15}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500 w-min">Post</Button>
      </form>
    </Form>
  )
}

export default PostThread