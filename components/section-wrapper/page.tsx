export default function SectionWrapper({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700 shadow-sm">
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}
