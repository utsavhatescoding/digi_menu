"use client";
import {useMemo,useState} from "react";

type Menu={business_name:string;currency:string;categories:Array<{category_name:string;items:Array<{item_name:string;price:number|null}>}>};
type Props={menu:Menu;businessName:string;phone:string;whatsapp:string;mapsUrl:string};
const Icon=({name}:{name:"search"|"phone"|"whatsapp"|"maps"})=>{
  const paths={search:<><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,phone:<path d="M7 3h3l1.5 4-2 1.5a16 16 0 0 0 6 6L17 12.5l4 1.5v3c0 2-2 4-4 4C9 20 4 15 3 7c0-2 2-4 4-4Z"/>,whatsapp:<><path d="M20 11.5a8.5 8.5 0 0 1-12.7 7.4L3 20l1.1-4.2A8.5 8.5 0 1 1 20 11.5Z"/><path d="M8.5 8.2c.8 2.7 2.6 4.5 5.3 5.3"/></>,maps:<><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>};
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
};
export default function CustomerMenu({menu,businessName,phone,whatsapp,mapsUrl}:Props){
  const[query,setQuery]=useState("");
  const categories=useMemo(()=>menu.categories.map((category,index)=>({...category,id:`category-${index}`,items:category.items.filter(item=>item.item_name.toLowerCase().includes(query.trim().toLowerCase()))})).filter(category=>category.items.length),[menu,query]);
  const total=menu.categories.reduce((sum,category)=>sum+category.items.length,0),initials=businessName.split(/\s+/).slice(0,2).map(word=>word[0]).join("").toUpperCase();
  const tel=phone?`tel:${phone}`:"",wa=whatsapp?`https://wa.me/${whatsapp.replace(/\D/g,"")}`:"";
  return <main className="digitalMenu">
    <header className="menuIdentity"><div className="menuIdentityTop"><span className="menuAvatar">{initials}</span><span className="verifiedPill"><i>✓</i> Owner verified</span></div><p>Digital menu</p><h1>{businessName}</h1><div className="menuMeta"><span>{total} items</span><i></i><span>Prices in {menu.currency||"NPR"}</span></div>{(tel||wa||mapsUrl)&&<div className="heroActions">{tel&&<a href={tel}><Icon name="phone"/><span>Call</span></a>}{wa&&<a href={wa} target="_blank" rel="noreferrer"><Icon name="whatsapp"/><span>WhatsApp</span></a>}{mapsUrl&&<a href={mapsUrl} target="_blank" rel="noreferrer"><Icon name="maps"/><span>Directions</span></a>}</div>}</header>
    <div className="menuTools"><div className="searchMenu"><Icon name="search"/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search the menu" aria-label="Search menu"/>{query&&<button onClick={()=>setQuery("")} aria-label="Clear search">×</button>}</div>{!query&&<nav className="categoryRail" aria-label="Menu categories">{menu.categories.map((category,index)=><a key={index} href={`#category-${index}`}>{category.category_name}</a>)}</nav>}</div>
    <div className="menuContent">{categories.length?categories.map(category=><section className="modernCategory" id={category.id} key={category.id}><div className="categoryHeading"><h2>{category.category_name}</h2><span>{category.items.length}</span></div><div className="itemList">{category.items.map((item,index)=><article className="modernItem" key={`${item.item_name}-${index}`}><div><h3>{item.item_name}</h3></div><strong>{item.price===null?"Ask":<><small>Rs</small>{item.price.toLocaleString("en-IN")}</>}</strong></article>)}</div></section>):<div className="noResults"><Icon name="search"/><h2>No items found</h2><p>Try a different item name.</p><button onClick={()=>setQuery("")}>Clear search</button></div>}</div>
    <footer className="digitalFooter"><span className="brandMark">म</span><p>Menu powered by <strong>MenuSathi</strong></p><small>Prices and availability are managed by the restaurant.</small></footer>
  </main>
}
