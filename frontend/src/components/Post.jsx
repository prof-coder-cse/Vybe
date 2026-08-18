import React, { useEffect, useState } from 'react'
import dp from "../assets/dp.webp"
import VideoPlayer from './VideoPlayer'
import { GoHeart, GoHeartFill, GoBookmarkFill } from "react-icons/go"
import { MdOutlineComment, MdOutlineBookmarkBorder } from "react-icons/md"
import { IoSendSharp } from "react-icons/io5"
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import { setPostData } from '../redux/postSlice'
import { setUserData } from '../redux/userSlice'
import FollowButton from './FollowButton'
import { useNavigate } from 'react-router-dom'

function Post({ post }) {

  const { userData } = useSelector(state => state.user)
  const { postData } = useSelector(state => state.post)
  const { socket } = useSelector(state => state.socket)

  const [showComment, setShowComment] = useState(false)
  const [message, setMessage] = useState("")
  const [aiComments, setAiComments] = useState([])
  const [loadingAI, setLoadingAI] = useState(false)
  const [showAISuggestions, setShowAISuggestions] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Agar post ya author nahi hai to component render mat karo
  if (!post || !post.author) {
    return null
  }

  const handleLike = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/post/like/${post._id}`,
        { withCredentials: true }
      )

      const updatedPost = result.data

      const updatedPosts = postData.map(p =>
        p._id === post._id ? updatedPost : p
      )

      dispatch(setPostData(updatedPosts))

    } catch (error) {
      console.log(error)
    }
  }

  const handleComment = async () => {

    if (!message.trim()) return

    try {
      const result = await axios.post(
        `${serverUrl}/api/post/comment/${post._id}`,
        { message },
        { withCredentials: true }
      )

      const updatedPost = result.data

      const updatedPosts = postData.map(p =>
        p._id === post._id ? updatedPost : p
      )

      dispatch(setPostData(updatedPosts))
      setMessage("")

    } catch (error) {
      console.log(error.response?.data || error)
    }
  }

  const handleSaved = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/post/saved/${post._id}`,
        { withCredentials: true }
      )

      dispatch(setUserData(result.data))

    } catch (error) {
      console.log(error.response?.data || error)
    }
  }

  const handleAISuggestion = async () => {
    try {

      setLoadingAI(true)

      const result = await axios.post(
        `${serverUrl}/api/ai/comments`,
        {
          caption: post.caption || ""
        },
        {
          withCredentials: true
        }
      )

      console.log("AI Response:", result.data)

      setAiComments(result.data.comments || [])
      setShowAISuggestions(true)

    } catch (error) {

      console.log(
        "AI Error:",
        error.response?.data || error.message
      )

    } finally {

      setLoadingAI(false)

    }
  }

  useEffect(() => {

    const handleLikedPost = (updatedData) => {

      const updatedPosts = postData.map(p =>
        p._id === updatedData.postId
          ? { ...p, likes: updatedData.likes }
          : p
      )

      dispatch(setPostData(updatedPosts))
    }

    const handleCommentedPost = (updatedData) => {

      const updatedPosts = postData.map(p =>
        p._id === updatedData.postId
          ? { ...p, comments: updatedData.comments }
          : p
      )

      dispatch(setPostData(updatedPosts))
    }

    socket?.on("likedPost", handleLikedPost)
    socket?.on("commentedPost", handleCommentedPost)

    return () => {
      socket?.off("likedPost", handleLikedPost)
      socket?.off("commentedPost", handleCommentedPost)
    }

  }, [socket, postData, dispatch])

  const isLiked = post.likes?.includes(userData?._id)

  const isSaved = userData?.saved?.includes(post._id)

  return (

    <div className='w-[90%] flex flex-col gap-[10px] bg-white items-center shadow-2xl shadow-[#00000058] rounded-2xl pb-[20px]'>

      {/* POST HEADER */}

      <div className='w-full h-[80px] flex justify-between items-center px-[10px]'>

        <div
          className='flex justify-center items-center md:gap-[20px] gap-[10px] cursor-pointer'
          onClick={() =>
            navigate(`/profile/${post.author?.userName}`)
          }
        >

          <div className='w-[40px] h-[40px] md:w-[60px] md:h-[60px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>

            <img
              src={post.author?.profileImage || dp}
              alt=""
              className='w-full h-full object-cover'
            />

          </div>

          <div className='w-[150px] font-semibold truncate'>

            {post.author?.userName || "Unknown User"}

          </div>

        </div>

        {userData &&
          userData._id !== post.author?._id && (

            <FollowButton
              tailwind='px-[10px] min-w-[60px] md:min-w-[100px] py-[5px] h-[30px] md:h-[40px] bg-black text-white rounded-2xl text-[14px] md:text-[16px]'
              targetUserId={post.author?._id}
            />

          )}

      </div>


      {/* MEDIA */}

      <div className='w-[90%] flex items-center justify-center'>

        {post.mediaType === "image" && (

          <div className='w-[90%] flex items-center justify-center'>

            <img
              src={post.media}
              alt=""
              className='w-[80%] rounded-2xl object-cover'
            />

          </div>

        )}

        {post.mediaType === "video" && (

          <div className='w-[80%] flex flex-col items-center justify-center'>

            <VideoPlayer media={post.media} />

          </div>

        )}

      </div>


      {/* LIKE COMMENT AI SAVE */}

      <div className='w-full h-[60px] flex justify-between items-center px-[20px] mt-[10px]'>

        <div className='flex justify-center items-center gap-[10px]'>

          {/* LIKE */}

          <div className='flex justify-center items-center gap-[5px]'>

            {!isLiked && (

              <GoHeart
                className='w-[25px] cursor-pointer h-[25px]'
                onClick={handleLike}
              />

            )}

            {isLiked && (

              <GoHeartFill
                className='w-[25px] cursor-pointer h-[25px] text-red-600'
                onClick={handleLike}
              />

            )}

            <span>
              {post.likes?.length || 0}
            </span>

          </div>


          {/* COMMENT */}

          <div
            className='flex justify-center items-center gap-[5px] cursor-pointer'
            onClick={() => setShowComment(prev => !prev)}
          >

            <MdOutlineComment className='w-[25px] h-[25px]' />

            <span>
              {post.comments?.length || 0}
            </span>

          </div>


          {/* AI BUTTON */}

          <div className='px-[10px]'>

            <button
              onClick={handleAISuggestion}
              disabled={loadingAI}
              className='bg-black text-white px-4 py-2 rounded-xl'
            >

              {loadingAI
                ? "Generating..."
                : "✨ AI Suggest"}

            </button>

          </div>

        </div>


        {/* SAVE */}

        <div
          onClick={handleSaved}
          className='cursor-pointer'
        >

          {!isSaved && (

            <MdOutlineBookmarkBorder
              className='w-[25px] h-[25px]'
            />

          )}

          {isSaved && (

            <GoBookmarkFill
              className='w-[25px] h-[25px]'
            />

          )}

        </div>

      </div>


      {/* CAPTION */}

      {post.caption && (

        <div className='w-full px-[20px] gap-[10px] flex justify-start items-center'>

          <h1 className='font-semibold'>

            {post.author?.userName || "Unknown"}

          </h1>

          <div>
            {post.caption}
          </div>

        </div>

      )}


      {/* COMMENTS */}

      {showComment && (

        <div className='w-full flex flex-col gap-[30px] pb-[20px]'>

          <div className='w-full h-[80px] flex items-center justify-between px-[20px] relative'>

            <div className='w-[40px] h-[40px] md:w-[60px] md:h-[60px] border-2 border-black rounded-full overflow-hidden'>

              <img
                src={userData?.profileImage || dp}
                alt=""
                className='w-full h-full object-cover'
              />

            </div>

            <input
              type="text"
              className='px-[10px] border-b-2 border-b-gray-500 w-[75%] outline-none h-[40px]'
              placeholder='Write comment...'
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />

            <button
              className='absolute right-[20px] cursor-pointer'
              onClick={handleComment}
            >

              <IoSendSharp className='w-[25px] h-[25px]' />

            </button>

          </div>


          <div className='w-full max-h-[300px] overflow-auto'>

            {post.comments?.map((com, index) => (

              <div
                key={index}
                className='w-full px-[20px] py-[20px] flex items-center gap-[20px] border-b-2 border-b-gray-200'
              >

                <div className='w-[40px] h-[40px] md:w-[60px] md:h-[60px] border-2 border-black rounded-full overflow-hidden'>

                  <img
                    src={com.author?.profileImage || dp}
                    alt=""
                    className='w-full h-full object-cover'
                  />

                </div>

                <div>

                  <h3 className='font-semibold'>
                    {com.author?.userName || "Unknown User"}
                  </h3>

                  <p>
                    {com.message}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      )}


      {/* AI SUGGESTION POPUP */}

      {showAISuggestions && (

        <div className='fixed inset-0 bg-black/40 flex justify-center items-center z-50'>

          <div className='bg-white w-[90%] max-w-[400px] rounded-xl p-5'>

            <h2 className='font-bold text-xl mb-4'>
              ✨ AI Suggested Comments
            </h2>

            {aiComments.length === 0 && (

              <p>No suggestions available.</p>

            )}

            {aiComments.map((comment, index) => (

              <div
                key={index}
                className='flex justify-between items-center gap-[10px] py-3 border-b'
              >

                <span>{comment}</span>

                <button
                  className='bg-black text-white px-3 py-1 rounded-lg'
                  onClick={() => {

                    setMessage(comment)
                    setShowComment(true)
                    setShowAISuggestions(false)

                  }}
                >

                  Use

                </button>

              </div>

            ))}

            <button
              className='mt-4 w-full bg-red-500 text-white py-2 rounded-lg'
              onClick={() =>
                setShowAISuggestions(false)
              }
            >

              Close

            </button>

          </div>

        </div>

      )}

    </div>
  )
}

export default Post