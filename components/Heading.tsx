import clsx from 'clsx'

export const Heading = ({
  as: Comp = "h1",
  size = "4xl",
  children,
  className,
}: any) => {
  return (
    <Comp
      className={clsx(
        "font-source font-semibold tracking-tighter",
        size === "4xl" && "text-3xl md:text-4xl",
        size === "3xl" && "text-3xl",
        size === "2xl" && "text-2xl",
        size === "xl" && "text-xl",
        className
      )}
    >
      {children}
    </Comp>
  );
};
