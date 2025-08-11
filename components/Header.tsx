import Link from 'next/link';

export function Header() {
    return (
        <header className="sticky top-0 left-0 z-50 flex w-full items-center justify-end p-2">
            <Link href="/">
                <h1 className="font-squash-h4 w-fit font-flex text-[min(15vw,40px)] font-bold leading-none">◎</h1>
            </Link>
        </header>
    );
}
