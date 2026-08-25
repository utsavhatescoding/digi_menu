import {createClient} from "@supabase/supabase-js";
import {notFound} from "next/navigation";
import type {Metadata} from "next";
import CustomerMenu from "./CustomerMenu";

type Menu={business_name:string;currency:string;categories:Array<{category_name:string;items:Array<{item_name:string;price:number|null}>}>};
type Row={business_name:string;currency:string;phone:string;whatsapp:string;maps_url:string;menu_json:Menu};
function admin(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)return null;return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})}
async function loadMenu(slug:string){const client=admin();if(!client)return null;const {data}=await client.from("menus").select("business_name,currency,phone,whatsapp,maps_url,menu_json").eq("slug",slug).maybeSingle();return data as Row|null}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params,row=await loadMenu(slug);return row?{title:`${row.business_name} Menu`,description:`View ${row.business_name}'s latest digital menu and prices.`}:{title:"Menu not found"}}
export default async function CustomerMenuPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params,row=await loadMenu(slug);if(!row)notFound();
  return <CustomerMenu menu={row.menu_json} businessName={row.business_name} phone={row.phone} whatsapp={row.whatsapp} mapsUrl={row.maps_url}/>
}
