import clsx from 'clsx'

export const Bounded = ({
  as: Comp = "div",
  size = "base",
  className,
  children,
}: any) => {
  return (
    <Comp className={className}>
      <div
        className={clsx(
          "mx-auto w-full",
          size === "small" && "max-w-xl",
          size === "base" && "max-w-3xl",
          size === "wide" && "max-w-4xl",
          size === "widest" && "max-w-6xl"
        )}
      >
        {children}
      </div>
    </Comp>
  )
}
