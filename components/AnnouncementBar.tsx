import { announcement } from "@/config/site";

export function AnnouncementBar() {
  return (
    <div className="on-dark bg-deep text-white">
      <p className="wrap flex min-h-9 items-center justify-center gap-x-3 py-1.5 text-center text-[0.8125rem] font-medium leading-snug">
        {announcement.map((item, i) => (
          <span key={item} className={i === 1 ? "hidden items-center gap-x-3 sm:flex" : "flex items-center gap-x-3"}>
            {i > 0 ? <span aria-hidden="true" className="hidden text-sage sm:inline">•</span> : null}
            <span>{item}</span>
          </span>
        ))}
      </p>
    </div>
  );
}
