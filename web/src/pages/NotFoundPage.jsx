import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import { IconShield } from "../components/icons.jsx";

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand/10 text-brand">
        <IconShield className="h-7 w-7" />
      </div>
      <div>
        <h1 className="text-2xl font-black">404 — Page not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or may have moved.
        </p>
      </div>
      <Link to="/">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
