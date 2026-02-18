// // Assets
import {
  Keyboard_Arrow_Down,
  Keyboard_Arrow_Up,
  SearchIcon,
} from '../../assets/icons';

import React, { useEffect, useRef, useState } from 'react';

// Types
import { Post } from '../../types/post';

// Assets
// import Keyboard_Arrow_Down from '../../assets/icons/Keyboard_Arrow_Down.svg';
// import Keyboard_Arrow_Up from '../../assets/icons/Keyboard_Arrow_Up.svg';
// import SearchIcon from '../../assets/icons/SearchIcon.svg';

type DropdownProps = {
  label: string;
  posts: Post[];
  disabled?: boolean;
  reset?: boolean;
  selectedPostId?: number;
  // onChangePost: (postId: number) => void;
  onChangeSelectedPostIds: (postIds: number[]) => void;
};

const MultiPostSelectDropdown: React.FC<DropdownProps> = ({
  label,
  posts,
  disabled = false,
  // onChangePost,
  reset,
  // selectedPostId,
  onChangeSelectedPostIds,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // const [selectedPost, setSelectedPost] = useState<Post>({} as Post);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  // const [showTooltip, setShowTooltip] = useState(false);

  const [selectedPostIds, setSelectedPostIds] = useState<number[]>([]); // Track selected post IDs

  const dropdownRef = useRef<HTMLDivElement>(null);
  // const textRef = useRef<HTMLParagraphElement>(null);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  // const handlePostChange = (post: Post) => {
  //   setSelectedPost(post);
  //   setIsOpen(false);
  //   onChangePost(post.ID as number);
  //   setSearchTerm('');
  // };

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

  useEffect(() => {
    if (reset) {
      // setSelectedPost({} as Post);
      setSearchTerm('');
    }
  }, [reset]);

  // useEffect(() => {
  //   if (selectedPostId && posts.length > 0) {
  //     const foundPost = posts.find((post) => post.ID === selectedPostId);
  //     if (foundPost) {
  //       setSelectedPost(foundPost);
  //     }
  //   }
  // }, [selectedPostId, posts]);

  useEffect(() => {
    if (!posts) return;

    const filteredPostData = Object.values(posts).filter((post) =>
      post.postName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filteredPostData);
  }, [searchTerm, posts]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCheckboxChange = (postId: number) => {
    setSelectedPostIds((prev) => {
      const updated = prev.includes(postId)
        ? prev.filter((id) => id !== postId) // Remove if already selected
        : [...prev, postId]; // Add if not selected
      // onChangeSelectedPostIds(updated); // Pass updated IDs to parent
      return updated;
    });
  };

  // Check if the text is overflowing
  // useEffect(() => {
  //   if (textRef.current) {
  //     setShowTooltip(textRef.current.scrollWidth > textRef.current.clientWidth);
  //   }
  // }, [selectedPost.postName]);

  // Use useEffect to propagate changes to the parent after render
  useEffect(() => {
    onChangeSelectedPostIds(selectedPostIds); // Notify parent of changes
  }, [selectedPostIds, onChangeSelectedPostIds]);

  // const handleSelectAllChange = () => {
  //   if (selectedPostIds.length === posts.length) {
  //     setSelectedPostIds([]); // Deselect all
  //   } else {
  //     setSelectedPostIds(posts.map((post) => post.ID)); // Select all
  //   }
  // };
  const handleSelectAllChange = () => {
    if (selectedPostIds.length === posts.length) {
      setSelectedPostIds([]); // Deselect all
    } else {
      const validPostIds = posts
        .map((post) => post.ID)
        .filter((id): id is number & { __brand: 'unique' } => id !== undefined); // Filter out undefined values
      setSelectedPostIds(validPostIds); // Select all valid IDs
    }
  };

  return (
    <div
      className="dropdown-select-container w-96 2xl:w-[500px]"
      ref={dropdownRef}
    >
      <button
        disabled={disabled}
        className={`dropdown-select-button ${
          !disabled ? 'bg-white' : 'bg-gray-100'
        } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={toggleDropdown}
      >
        <span className="dropdown-select-span">
          {' '}
          <p>{label}</p>{' '}
        </span>
        <span className="transform transition-transform">
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
              type="search"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="dropdown-search-input"
            />
            <img
              src={SearchIcon}
              alt="Search Icon"
              className="dropdown-search-icon"
            />
          </div>
          <ul className="max-h-64 overflow-y-auto">
            <li className="flex items-center gap-2 p-2 dropdown-list-item hover:bg-gray-100 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedPostIds.length === posts.length}
                onChange={handleSelectAllChange}
              />
              <span className="font-medium text-responsive-input">
                Select All
              </span>
            </li>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <li
                  key={post.ID}
                  className="flex items-center gap-2 p-2 dropdown-list-item hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedPostIds.includes(post.ID as number)}
                    onChange={() => handleCheckboxChange(post.ID as number)}
                  />
                  <span className="dropdown-list-item pl-0 py-0">
                    {post.postName}
                  </span>
                </li>
              ))
            ) : (
              <li className="p-2 font-medium text-responsive-input">
                No results found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
  // return (
  //   <div
  //     className="relative w-40 md:w-52 lg:w-64 xl:w-80 font-Mona_Sans"
  //     ref={dropdownRef}
  //   >
  //     <button
  //       disabled={disabled}
  //       className={`flex items-center justify-between w-full ${!disabled ? 'bg-white' : 'bg-gray-100'} border border-gray-300 rounded-md text-xs md:text-sm lg:text-base p-2 lg:p-3 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
  //       onClick={toggleDropdown}
  //     >
  //       <span className="text-gray-700 lg:font-medium overflow-hidden">
  //         {label}
  //       </span>
  //       <span className="transform transition-transform">
  //         {isOpen ? (
  //           <img
  //             src={Keyboard_Arrow_Up}
  //             alt="Arrow Up"
  //             className="w-5 h-5 lg:w-6 lg:h-6"
  //           />
  //         ) : (
  //           <img
  //             src={Keyboard_Arrow_Down}
  //             alt="Arrow Down"
  //             className="w-5 h-5 lg:w-6 lg:h-6"
  //           />
  //         )}
  //       </span>
  //     </button>
  //     {isOpen && (
  //       <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-30 px-2 lg:px-4 py-1 lg:py-2">
  //         <div className="relative flex items-center pb-2">
  //           <input
  //             type="search"
  //             placeholder="Search"
  //             value={searchTerm}
  //             onChange={handleSearchChange}
  //             className="w-full h-full bg-transparent focus:outline-offset-1 focus:outline-1 focus:outline-inputBorder border border-smallMenuHover rounded-md py-1 lg:py-2 pl-8 pr-2 text-sm lg:text-base"
  //           />
  //           <img
  //             src={SearchIcon}
  //             alt="Search Icon"
  //             className="absolute top-1 lg:top-2 left-2 w-5 h-5"
  //           />
  //         </div>
  //         <ul className="max-h-40 overflow-y-auto">
  //           {filteredPosts.length > 0 ? (
  //             filteredPosts.map((post) => (
  //               <li
  //                 key={post.ID}
  //                 className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
  //               >
  //                 <input
  //                   type="checkbox"
  //                   checked={selectedPostIds.includes(post.ID as number)}
  //                   onChange={() => handleCheckboxChange(post.ID as number)}
  //                 />
  //                 <span className="font-medium text-xs lg:text-sm xl:text-base">
  //                   {post.postName}
  //                 </span>
  //               </li>
  //             ))
  //           ) : (
  //             <li className="p-2 text-gray-500">No results found</li>
  //           )}
  //         </ul>
  //       </div>
  //     )}
  //   </div>
  // );

  // return (
  //   <div
  //     className="relative w-40 md:w-52 lg:w-64 xl:w-80 font-Mona_Sans"
  //     ref={dropdownRef}
  //   >
  //     <button
  //       disabled={disabled}
  //       className={`flex items-center justify-between w-full ${!disabled ? 'bg-white' : 'bg-gray-100'} border border-gray-300 rounded-md text-xs md:text-sm lg:text-base p-2 lg:p-3 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
  //       onClick={toggleDropdown}
  //     >
  //       <span
  //         className={`text-gray-700 lg:font-medium overflow-hidden ${showTooltip ? 'tooltip' : ''}`}
  //         title={showTooltip ? selectedPost.postName : ''}
  //       >
  //         <p ref={textRef} className="truncate">
  //           {selectedPost.postName || label}
  //         </p>
  //       </span>
  //       <span className={`transform transition-transform`}>
  //         {isOpen ? (
  //           <img
  //             src={Keyboard_Arrow_Up}
  //             alt="Arrow Up"
  //             className="w-5 h-5 lg:w-6 lg:h-6"
  //           />
  //         ) : (
  //           <img
  //             src={Keyboard_Arrow_Down}
  //             alt="Arrow Down"
  //             className="w-5 h-5 lg:w-6 lg:h-6"
  //           />
  //         )}
  //       </span>
  //     </button>
  //     {isOpen && (
  //       <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-30 px-2 lg:px-4 py-1 lg:py-2">
  //         <div className="relative flex items-center pb-2">
  //           <input
  //             type="search"
  //             placeholder="Search"
  //             value={searchTerm}
  //             onChange={handleSearchChange}
  //             className="w-full h-full bg-transparent focus:outline-offset-1 focus:outline-1 focus:outline-inputBorder border border-smallMenuHover rounded-md py-1 lg:py-2 pl-8 pr-2 text-sm lg:text-base"
  //           />
  //           <img
  //             src={SearchIcon}
  //             alt="Search Icon"
  //             className="absolute top-1 lg:top-2 left-2 w-5 h-5"
  //           />
  //         </div>
  //         <ul className="max-h-40 overflow-y-auto">
  //           {filteredPosts.length > 0 ? (
  //             filteredPosts.map((post, index) => (
  //               <li
  //                 key={index}
  //                 className="p-2 hover:bg-gray-100 cursor-pointer font-medium text-xs lg:text-sm xl:text-base"
  //                 onClick={() => handlePostChange(post)}
  //               >
  //                 {post.postName}
  //               </li>
  //             ))
  //           ) : (
  //             <li className="p-2 text-gray-500">No results found</li>
  //           )}
  //         </ul>
  //       </div>
  //     )}
  //   </div>
  // );
};

export default MultiPostSelectDropdown;
