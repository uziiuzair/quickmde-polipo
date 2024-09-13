"use client"

import { useCallback, useEffect, useState } from "react"
import Markdown from "react-markdown"

import _ from "lodash"
import Link from "next/link"
import { F } from "polipo/react"
import remarkGfm from "remark-gfm"

import { LoadingIcon } from "@/components/loading-icon"
import { PostProvider, usePostContext } from "@/providers/post-provider"

export default function Page({
  params,
}: {
  params: {
    pageId: string
  }
}) {
  return (
    <PostProvider postId={params.pageId}>
      <PostContent />
    </PostProvider>
  )
}

const PostContent = () => {
  const [loading, setLoading] = useState(false)
  const [markdown, setMarkdown] = useState("# Hello, world!")

  const {
    post,
    postIsLoading,
    updatePost,
    postMutate: mutate,
  } = usePostContext()

  const debouncedUpdate = useCallback(
    _.debounce(() => {
      setLoading(true)

      if (markdown != "# Hello, world!") {
        updatePost(markdown)
          .then(() => {
            mutate()
          })
          .finally(() => {
            setTimeout(() => {
              setLoading(false)
            }, 1000)
          })
      } else {
        setLoading(false)
      }
    }, 1000),
    [markdown, updatePost, mutate] // All dependencies must be correctly passed here
  )

  useEffect(() => {
    if (!postIsLoading && post?.markdown) {
      setMarkdown(post.markdown)
    }
  }, [post, postIsLoading])

  useEffect(() => {
    if (markdown) {
      debouncedUpdate()
    }

    return () => {
      debouncedUpdate.cancel()
    }
  }, [markdown, debouncedUpdate])

  return (
    <F layout="Page1/Home w-fill">
      {{
        Header: (
          <F>
            {{
              Link: (
                <F
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `https://www.quickmde.com/post/${post.id}`
                    )
                  }}
                  children={
                    post && (
                      <button
                        className="w-fit rounded-xl bg-slate-100 px-6 py-4 text-sm text-slate-600 transition-all duration-300 active:bg-violet-100 active:text-violet-600"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `https://www.quickmde.com/post/${post.id}`
                          )
                        }}
                      >
                        {`https://www.quickmde.com/post/${post.id}`}
                      </button>
                    )
                  }
                ></F>
              ),
              Github: (
                <F
                  layout="Page1/Github hover:Page1/GithubHover"
                  as={Link}
                  href="https://github.com/uziiuzair/quickmde"
                  target="_blank"
                />
              ),
            }}
          </F>
        ),
        Editor: (
          <F>
            <div className="relative h-full w-full">
              <div className="absolute right-3 top-3 flex h-12 w-12 items-center justify-center">
                {loading ? <LoadingIcon /> : ""}
              </div>
              <textarea
                className="h-full w-full resize-none rounded-3xl border-0 bg-transparent p-16 text-lg text-slate-950 outline-none ring-0 placeholder:text-slate-400 focus:ring-0"
                onChange={(event) =>
                  !postIsLoading && setMarkdown(event.target.value)
                }
                placeholder="Type some markdown..."
                value={postIsLoading ? "" : markdown}
              />
            </div>
          </F>
        ),
        Preview: (
          <F>
            <div className="relative h-full w-full">
              <div className="prose h-full overflow-y-scroll p-16">
                <Markdown
                  className="w-full"
                  remarkPlugins={[remarkGfm]}
                >
                  {markdown}
                </Markdown>
              </div>
            </div>
          </F>
        ),
      }}
    </F>
  )
}
