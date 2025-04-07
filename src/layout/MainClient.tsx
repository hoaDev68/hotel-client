import FooterClient from "@/component/FooterClient";
import HeaderClient from "@/component/HeaderClient/HeaderClient";

function MainClient({ children }: { children: React.ReactNode }) {
    return (
        <>
            <HeaderClient />
            <main>{children}</main>
            <FooterClient />
        </>
    )
}
export {    MainClient }