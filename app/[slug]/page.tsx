import {createClient} from "@supabase/supabase-js";
import {notFound} from "next/navigation";
import type {Metadata} from "next";

type Menu={business_name:string;currency:string;categories:Array<{category_name:string;items:Array<{item_name:string;price:number|null}>}>};
type Row={business_name:string;currency:string;phone:string;whatsapp:string;maps_url:string;menu_json:Menu};
function admin(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)return null;return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})}
async function loadMenu(slug:string){const client=admin();if(!client)return null;const {data}=await client.from("menus").select("business_name,currency,phone,whatsapp,maps_url,menu_json").eq("slug",slug).maybeSingle();return data as Row|null}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params,row=await loadMenu(slug);return row?{title:`${row.business_name} Menu`,description:`View ${row.business_name}'s latest digital menu and prices.`}:{title:"Menu not found"}}
export default async function CustomerMenu({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params,row=await loadMenu(slug);if(!row)notFound();const menu=row.menu_json;
  const tel=row.phone?`tel:${row.phone}`:"",wa=row.whatsapp?`https://wa.me/${row.whatsapp.replace(/\D/g,"")}`:"";
  return <main className="customerPage"><header className="customerHero"><a className="brand customerBrand" href="/"><span className="brandMark">म</span>MenuSathi</a><p>Digital menu</p><h1>{row.business_name}</h1><span>Prices in {row.currency||"NPR"}</span></header><div className="customerMenu">{menu.categories.map((category,ci)=><section className="customerCategory" key={ci}><h2>{category.category_name}</h2>{category.items.map((item,ii)=><div className="customerItem" key={ii}><span>{item.item_name}</span><strong>{item.price===null?"—":`Rs ${item.price}`}</strong></div>)}</section>)}</div>{(tel||wa||row.maps_url)&&<nav className="contactBar" aria-label="Contact restaurant">{tel&&<a href={tel}>Call</a>}{wa&&<a href={wa} target="_blank" rel="noreferrer">WhatsApp</a>}{row.maps_url&&<a href={row.maps_url} target="_blank" rel="noreferrer">Maps</a>}</nav>}<footer className="customerFooter">Menu powered by <a href="/">MenuSathi</a></footer></main>
}
