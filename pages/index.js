import useSWR from "swr";
import { parseISO, format } from "date-fns";
import { useState } from "react";
import { Menu } from "@headlessui/react";
import { motion } from "framer-motion";

const fetcher = (url) => fetch(url).then((res) => res.json());

function useBufferedData(url) {
  let { error, data } = useSWR(url, fetcher);
  let [buffer, setBuffer] = useState(data);

  if (data && !buffer) setBuffer(data);

  return {
    data: buffer,
    error,
    stale: buffer !== data,
    update: () => setBuffer(data),
  };
}

function Home() {
  let { data, error, stale, update } = useBufferedData("/api/tweets");

  if (error) return "An error has occurred.";
  if (!data)
    return (
      <p className="px-4 py-2 mt-32 text-lg font-medium text-center text-gray-400">
        Loading...
      </p>
    );

  return (
    <div>
      {stale && (
        <div className="absolute inset-x-0 flex justify-center top-20">
          <button
            onClick={update}
            className="flex items-center px-4 py-1 text-white bg-blue-500 rounded-full shadow-lg focus:outline-none focus:shadow-outline"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
            See new Tweets
          </button>
        </div>
      )}
      <div className="divide-y divide-gray-200">
        {[...data?.tweets].reverse().map((tweet) => (
          <div className="px-4 py-2" key={tweet.id}>
            <Tweet tweet={tweet} />
          </div>
        ))}
      </div>
    </div>
  );
}

Home.headerTitle = "Latest Tweets";
Home.headerBorder = true;

export default Home;

function Tweet({ tweet }) {
  return (
    <div className="flex">
      <img className="w-12 h-12 mr-3 rounded-full" src={tweet.avatarUrl} />

      <div className="flex flex-col min-w-0">
        <p className="flex items-center max-w-full font-bold">
          <span className="overflow-hidden whitespace-no-wrap">
            <span>{tweet.name}</span>
            <span className="pl-3 font-normal text-gray-500">
              @{tweet.username}
            </span>
          </span>
          <span className="flex-shrink-0 font-normal text-gray-500">
            <span className="px-1 text-xs text-gray-500">·</span>
            {format(parseISO(tweet.date), "MMM d")}
          </span>
        </p>

        <p className="text-sm">{tweet.text}</p>

        {/* Icon bar */}
        <div className="flex justify-between max-w-sm mt-1 text-cool-gray-500">
          <button className="p-2 transition duration-150 ease-in-out rounded-full hover:bg-blue-100 hover:text-blue-500 focus:bg-blue-100 focus:text-blue-500 focus:outline-none">
            <CommentIcon />
          </button>
          <button className="p-2 transition duration-150 ease-in-out rounded-full hover:bg-blue-100 hover:text-blue-500 focus:bg-blue-100 focus:text-blue-500 focus:outline-none">
            <RetweetIcon />
          </button>
          <button className="p-2 transition duration-150 ease-in-out rounded-full hover:bg-blue-100 hover:text-blue-500 focus:bg-blue-100 focus:text-blue-500 focus:outline-none">
            <HeartIcon />
          </button>

          <div className="relative">
            <Menu>
              {({ open }) => (
                <>
                  <Menu.Button className="p-2 transition duration-150 ease-in-out rounded-full hover:bg-blue-100 hover:text-blue-500 focus:bg-blue-100 focus:text-blue-500 focus:outline-none">
                    <ShareIcon />
                  </Menu.Button>

                  {open && (
                    <Menu.Items
                      as={motion.div}
                      static
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 z-10 bg-white border rounded shadow focus:outline-none border-cool-gray-200"
                    >
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            className={`${
                              active ? "bg-cool-gray-200" : ""
                            } block px-5 py-3 whitespace-no-wrap`}
                            href="#"
                          >
                            Send via Direct Message
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            className={`${
                              active ? "bg-cool-gray-200" : ""
                            } block px-5 py-3 whitespace-no-wrap`}
                            href="#"
                          >
                            Add Tweet to Bookmarks
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            className={`${
                              active ? "bg-cool-gray-200" : ""
                            } block px-5 py-3 whitespace-no-wrap`}
                            href="#"
                          >
                            Copy link to Tweet
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  )}
                </>
              )}
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 p-px fill-current">
      <g>
        <path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></path>
      </g>
    </svg>
  );
}

function RetweetIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 p-px fill-current">
      <g>
        <path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"></path>
      </g>
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 p-px fill-current">
      <g>
        <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"></path>
      </g>
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 p-px fill-current">
      <g>
        <path d="M17.53 7.47l-5-5c-.293-.293-.768-.293-1.06 0l-5 5c-.294.293-.294.768 0 1.06s.767.294 1.06 0l3.72-3.72V15c0 .414.336.75.75.75s.75-.336.75-.75V4.81l3.72 3.72c.146.147.338.22.53.22s.384-.072.53-.22c.293-.293.293-.767 0-1.06z"></path>
        <path d="M19.708 21.944H4.292C3.028 21.944 2 20.916 2 19.652V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 .437.355.792.792.792h15.416c.437 0 .792-.355.792-.792V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 1.264-1.028 2.292-2.292 2.292z"></path>
      </g>
    </svg>
  );
}
