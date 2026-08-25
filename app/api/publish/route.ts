import {NextRequest,NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";

type Menu={business_name:string;currency:string;categories:Array<{category_name:string;items:Array<{item_name:string;price:number|null}>}>};
const cleanPhone=(value:string)=>value.replace(/[^\d+]/g,"").slice(0,18);
const cleanSlug=(value:string)=>value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g,"").replace(/[\s-]+/g,"-").replace(/^-|-$/g,"").slice(0,60);
function admin(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)throw new Error("Supabase is not configured");return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})}

export async function POST(request:NextRequest){
  try{
    const body=await request.json() as {menu?:Menu;slug?:string;phone?:string;whatsapp?:string;mapsUrl?:string};
    const menu=body.menu,slug=cleanSlug(body.slug||menu?.business_name||"");
    if(!menu?.business_name?.trim()||!menu.categories?.length)return NextResponse.json({error:"Add a business name and at least one category."},{status:400});
    if(slug.length<3)return NextResponse.json({error:"Please use a longer public-link name."},{status:400});
    const mapsUrl=(body.mapsUrl||"").trim();
    if(mapsUrl&&!/^https:\/\//i.test(mapsUrl))return NextResponse.json({error:"Maps link must begin with https://"},{status:400});
    const {error}=await admin().from("menus").upsert({slug,business_name:menu.business_name.trim(),currency:menu.currency||"NPR",phone:cleanPhone(body.phone||""),whatsapp:cleanPhone(body.whatsapp||""),maps_url:mapsUrl,menu_json:menu,published_at:new Date().toISOString()},{onConflict:"slug"});
    if(error)throw error;
    return NextResponse.json({slug,path:`/${slug}`});
    }catch(error){
  console.error("Menu publish failed:", error);

  const configuration =
    error instanceof Error && error.message.includes("not configured");

  return NextResponse.json(
    {
      error: configuration
        ? "Supabase is not connected yet."
        : "The menu could not be published. Please try again."
    },
    { status: 500 }
  );
}
}
