// Libraries
import React, { useEffect, useRef, useState } from 'react';

// Types
import { Post } from '../../types/post';

// Assets
import {
  Keyboard_Arrow_Down,
  Keyboard_Arrow_Up,
  SearchIcon,
} from '../../assets/icons';

// Prop Types
type DropdownProps = {
  label: string;
  posts: Post[];
  disabled?: boolean;
  reset?: boolean;
  selectedPostId?: number;
  onChangePost: (postId: number) => void;
};

// Main Component
const PostSelectDropdown: React.FC<DropdownProps> = ({
  label,
  posts,
  disabled = false,
  onChangePost,
  reset,
  selectedPostId,
}) => {
  const [isOpen, setIsOpen] = useState(selectedPostId ? false : true);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (selectedPostId) setIsOpen(false);
  }, [selectedPostId]);
  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Toggle the dropdown
  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  // Handle search change
  const [searchTerm, setSearchTerm] = useState('');
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Filter the posts based on the search term
  useEffect(() => {
    if (!posts) return;

    const filteredPostData = Object.values(posts).filter((post) =>
      post.postName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filteredPostData);
  }, [searchTerm, posts]);

  // Handle post change and close the dropdown
  const [selectedPost, setSelectedPost] = useState<Post>({} as Post);
  const handlePostChange = (post: Post) => {
    setSelectedPost(post);
    setIsOpen(false);
    onChangePost(post.ID as number);
    setSearchTerm('');
  };

  // Set the selected post based on the selectedPostId
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  useEffect(() => {
    if (selectedPostId && posts.length > 0) {
      const foundPost = posts.find((post) => post.ID === selectedPostId);
      if (foundPost) {
        setSelectedPost(foundPost);
      }
    }
  }, [selectedPostId, posts]);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reset the search term when the dropdown is closed
  // Focus the search input when the dropdown is opened
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
    }
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Reset the selected post and search term when the reset prop is true
  useEffect(() => {
    if (reset) {
      setSelectedPost({} as Post);
      setSearchTerm('');
    }
  }, [reset]);

  // Check if the text is overflowing
  useEffect(() => {
    if (textRef.current) {
      setShowTooltip(textRef.current.scrollWidth > textRef.current.clientWidth);
    }
  }, [selectedPost.postName]);

  return (
    <div
      className="dropdown-select-container w-96 2xl:w-[500px]"
      ref={dropdownRef}
    >
      <button
        disabled={disabled}
        className={`dropdown-select-button ${!disabled ? 'bg-white' : 'bg-gray-100'} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={toggleDropdown}
      >
        <span
          className={`dropdown-select-span ${showTooltip ? 'tooltip' : ''}`}
          title={showTooltip ? selectedPost.postName : ''}
        >
          <p ref={textRef} className="truncate">
            {selectedPost.postName || label}
          </p>
        </span>
        <span className={`transform transition-transform`}>
          {isOpen ? (
            <img
              src={Keyboard_Arrow_Up}
              alt="Arrow Up"
              className="dropdown-menu-icon"
            />
          ) : (
            <img
              src={Keyboard_Arrow_Down}
              alt="Arrow Down"
              className="dropdown-menu-icon"
            />
          )}
        </span>
      </button>
      {isOpen && (
        <div className="dropdown-dropped-container">
          <div className="relative flex items-center mb-2">
            <input
              ref={searchInputRef}
              type="search"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="dropdown-search-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && filteredPosts.length === 1) {
                  handlePostChange(filteredPosts[0]);
                }
              }}
            />
            <img
              src={SearchIcon}
              alt="Search Icon"
              className="dropdown-search-icon"
            />
          </div>
          <ul className="max-h-64 overflow-y-auto">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <li
                  key={index}
                  className="dropdown-list-item"
                  onClick={() => handlePostChange(post)}
                >
                  {post.postName}
                </li>
              ))
            ) : (
              <li className="px-2 text-gray-500 text-responsive-input">
                No results found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PostSelectDropdown;
