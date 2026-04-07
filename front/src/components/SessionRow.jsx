import React from "react";

const SessionRow = ({ date, sessions, formatDate }) => {
  return (
    <div className="flex items-center gap-6">

      <span className="text-sm text-gray-600 min-w-[110px]">
        {formatDate(date)}
      </span>

      <div className="grid grid-cols-4 gap-2">
        {sessions.map((s) => (
          <button
            key={s._id}
            className="w-[70px] py-1 text-sm border border-borderColor
              rounded-full transition hover:bg-[#E8A7AF] hover:border-transparent"
          >
            {s.time}
          </button>
        ))}
      </div>

    </div>
  );
};

export default SessionRow;