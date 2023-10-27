"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import Profile from "@components/Profile";

function MyProfile() {
  const params = useParams();

  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${params.id}/posts`);
      const data = await response.json();
      setPosts(data);
      setUser(data[0].creator);
    };

    if (params.id) fetchPosts();
  }, [params.id]);

  return (
    <Profile
      name={user.username}
      description={`Welcome to ${user.username} personalized profile page. Explore ${user.username} exceptional prompts and be inspired by the power of their imagination`}
      data={posts}
    />
  );
}

export default MyProfile;
