"use client";

import { useCallback, useEffect, useState } from "react";
import debounce from "lodash.debounce";
import PromptCard from "./PromptCard";

const PromptCardList = (props) => {
  const { data, handleTagClick } = props;

  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

export default function Feed() {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);

  const handleSearchChange = useCallback((ev) => {
    setSearchText(ev.target.value);
    debouncedFetchPosts(ev.target.value);
  }, []);

  const filterPosts = (v = "") => {
    let filteredPosts = [...posts];

    if (!v) {
      fetchPosts();
      return;
    }

    filteredPosts = filteredPosts.filter((post) => {
      return (
        `${post.prompt} ${post.tag} ${post.creator.username}`
          .toLowerCase()
          .trim()
          .indexOf(v.toLowerCase().trim()) !== -1
      );
    });

    setPosts(filteredPosts);
  };

  const fetchPosts = async () => {
    const response = await fetch("/api/prompt");
    const data = await response.json();
    setPosts(data);
  };

  const debouncedFetchPosts = debounce(filterPosts, 300, true);

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
        {searchText && (
          <span
            className="absolute right-3 cursor-pointer"
            onClick={() => {
              setSearchText("");
              debouncedFetchPosts("");
            }}
          >
            &#10006;
          </span>
        )}
      </form>

      <PromptCardList
        data={posts}
        handleTagClick={(tag) => {
          setSearchText(tag);
          debouncedFetchPosts(tag);
        }}
      />
    </section>
  );
}
