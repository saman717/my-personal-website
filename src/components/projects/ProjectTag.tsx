interface ProjectTagProps {
  label: string;
}

export default function ProjectTag({ label }: ProjectTagProps) {
  return (
    <span className="bg-[#2d1b38] text-[#b388ff] px-3 py-1 rounded-md text-xs font-medium border border-[#3d2b48]/30 hover:bg-[#3d2b48] transition-colors duration-200">
      {label}
    </span>
  );
}