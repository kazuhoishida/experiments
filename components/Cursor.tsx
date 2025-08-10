type Props = {
    isVisible: boolean;
    position: {
        x: number;
        y: number;
    };
};

const Cursor = ({ isVisible, position }: Props) => {
    return (
        <div
            className={`
        absolute top-[var(--cursor-y)] left-[var(--cursor-x)] ${isVisible ? 'scale-100' : 'scale-0'}
        font-squash-h4 pointer-events-none hidden h-40
        w-40 translate-x-[-4rem] translate-y-[-4rem]
        place-content-center place-items-center overflow-hidden rounded-full font-flex text-[17px]
        backdrop-invert transition-transform duration-[400ms] md:flex
      `}
            style={{
                '--cursor-x': `${position.x - 24}px`,
                '--cursor-y': `${position.y - 28}px`,
                'text-stroke': '1px #666',
                '-webkit-text-stroke': '1px #666',
            }}
        >
            VIEW
        </div>
    );
};

export default Cursor;
