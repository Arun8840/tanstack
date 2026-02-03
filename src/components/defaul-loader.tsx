import { Spinner } from "./ui/spinner";

function DefaultLoader() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Spinner />
        </div>
    );
}

export default DefaultLoader;