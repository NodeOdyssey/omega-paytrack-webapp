import React, { useEffect, useRef, useState } from 'react';
import { Keyboard_Arrow_Down, Keyboard_Arrow_Up } from '../../assets/icons';
import { Post } from '../../types/post';

type CustomSelectProps = {
  posts: Post[];
  placeholder: string;
  updateSelectedPostDetails: (postId: number) => void;
};

const CustomPostNameDropDown: React.FC<CustomSelectProps> = ({
  posts,
  placeholder,
  updateSelectedPostDetails,
}) => {
  const [selectedPostName, setSelectedPostName] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const customRankDropDownRef = useRef<HTMLDivElement>(null);

  const handleSelectPost = (postId: number, postName: string) => {
    setSelectedPostName(postName);
    updateSelectedPostDetails(postId);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        customRankDropDownRef.current &&
        !customRankDropDownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="relative inline-block w-64" ref={customRankDropDownRef}>
        <div
          className="flex items-center justify-between w-full p-4 rounded-lg cursor-pointer bg-white border border-gray-300"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          data-tooltip-id="postName"
          data-tooltip-content="Select a Post to begin scheduling"
        >
          <span className="text-gray-500">
            {selectedPostName || placeholder}
          </span>
          {isDropdownOpen ? (
            <img src={Keyboard_Arrow_Up} alt="" />
          ) : (
            <img src={Keyboard_Arrow_Down} alt="" />
          )}
        </div>
        {isDropdownOpen && (
          <ul className="absolute z-50 w-full bg-white border rounded-lg mt-1 max-h-60 overflow-auto">
            {posts.map((post) => (
              <li
                key={post.ID}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() =>
                  handleSelectPost(post.ID as number, post.postName)
                }
              >
                {post.postName}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default CustomPostNameDropDown;
