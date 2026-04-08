import React from "react";
import { useNavigate } from "react-router-dom";

const SessionRow = ({ date, sessions, formatDate, formats = [] }) => {
  const navigate = useNavigate();
  
  const filteredSessions =
    formats.length > 0
      ? sessions.filter((s) =>
          formats.some((f) => s.format === f.value)
        )
      : sessions;

  if (filteredSessions.length === 0) return null;

  return (
    <div className="flex items-center gap-6">

      <span className="text-sm text-gray-600 min-w-[110px]">
        {formatDate(date)}
      </span>

      <div className="grid grid-cols-4 gap-2">
        {filteredSessions.map((s) => (
          <button
            key={s._id}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/session/${s._id}`);
            }}
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