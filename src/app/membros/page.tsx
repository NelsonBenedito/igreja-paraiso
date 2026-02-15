import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import MembrosClient from "./MembrosClient";

export default async function MembersPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    return <MembrosClient user={{ email: user.email }} />;
}
