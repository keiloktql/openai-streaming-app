/* eslint-disable react/no-unescaped-entities */
import { useCompletion } from "ai/react";
import { toast } from "react-toastify";
import { IoMdSend } from "react-icons/io";
import { useState } from "react";

const HomePage = () => {
  const [text, setText] = useState("");

  const { completion, complete, isLoading } = useCompletion({
    api: "/api/completion",
    onResponse: (res) => {
      if (res.status === 429) {
        toast.error("You are being rate limited. Please try again later.");
        return;
      }
      if (res.status !== 200) {
        toast.error("An error occured!");
        return;
      }
    },
    onFinish: () => {
      toast.success("Successfully generated completion!");
      setText("");
    }
  });

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    complete(text);
  };

  return (
    <div>
      <h1 className="text-center text-display-md font-semibold text-gray-900 mt-40">
        Generate fun facts about a product's carbon emission
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-center justify-center "
      >
        <p className="mt-4">{completion}</p>
        <div className="fixed max-w-[1000px] w-full bottom-8">
          <input
            className="w-full rounded border border-solid border-gray-300 bg-white px-4 py-2.5 transition duration-300 placeholder:text-gray-500 focus:outline-none focus:ring focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50"
            value={text}
            placeholder="Enter a product title..."
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <button
            disabled={isLoading}
            type="submit"
            className="absolute top-3 right-3"
          >
            <IoMdSend
              className={`${
                isLoading ? "text-gray-300" : "text-[#1c1c1c]"
              } text-[21px]`}
            />
          </button>
        </div>
      </form>
    </div>
  );
};

export default HomePage;
