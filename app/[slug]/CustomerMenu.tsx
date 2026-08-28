"use client";
import {useMemo,useState} from "react";

type MenuItem={item_name:string;price:number|null;description?:string;tags?:string[];badge?:string;portion?:string};
type Menu={business_name:string;currency:string;categories:Array<{category_name:string;items:MenuItem[]}>};
type Props={menu:Menu;businessName:string;phone:string;whatsapp:string;mapsUrl:string};
type FlatItem=MenuItem&{id:string;category:string};
type Filter="all"|"value"|"under200"|"special"|"drinks";

const Icon=({name}:{name:"search"|"phone"|"whatsapp"|"maps"|"spark"|"plus"|"list"|"close"})=>{
  const paths={search:<><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,phone:<path d="M7 3h3l1.5 4-2 1.5a16 16 0 0 0 6 6L17 12.5l4 1.5v3c0 2-2 4-4 4C9 20 4 15 3 7c0-2 2-4 4-4Z"/>,whatsapp:<><path d="M20 11.5a8.5 8.5 0 0 1-12.7 7.4L3 20l1.1-4.2A8.5 8.5 0 1 1 20 11.5Z"/><path d="M8.5 8.2c.8 2.7 2.6 4.5 5.3 5.3"/></>,maps:<><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,spark:<><path d="m12 2 1.6 5.1L19 9l-5.4 1.9L12 16l-1.6-5.1L5 9l5.4-1.9L12 2Z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/></>,plus:<><path d="M12 5v14M5 12h14"/></>,list:<><path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r=".7" fill="currentColor"/><circle cx="4" cy="12" r=".7" fill="currentColor"/><circle cx="4" cy="18" r=".7" fill="currentColor"/></>,close:<><path d="m6 6 12 12M18 6 6 18"/></>};
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
};

const drinkWords=/tea|चिया|chai|coffee|lassi|juice|soda|shake|smoothie|mojito|sip|drink|lemon|water|cola/i;
const specialWords=/special|signature|chef|house|irani|premium/i;

export default function CustomerMenu({menu,businessName,phone,whatsapp,mapsUrl}:Props){
  const[query,setQuery]=useState("");
  const[filter,setFilter]=useState<Filter>("all");
  const[shortlist,setShortlist]=useState<FlatItem[]>([]);
  const[showShortlist,setShowShortlist]=useState(false);
  const[showGuide,setShowGuide]=useState(false);
  const[mood,setMood]=useState<"signature"|"refreshing"|"value"|"anything">("anything");
  const[budget,setBudget]=useState<"150"|"300"|"any">("any");
  const flat=useMemo(()=>menu.categories.flatMap((category,ci)=>category.items.map((item,ii)=>({...item,category:category.category_name,id:`${ci}-${ii}`}))),[menu]);
  const total=flat.length,initials=businessName.split(/\s+/).slice(0,2).map(word=>word[0]).join("").toUpperCase();
  const tel=phone?`tel:${phone}`:"",wa=whatsapp?`https://wa.me/${whatsapp.replace(/\D/g,"")}`:"";
  const currency=menu.currency||"NPR";
  const money=(price:number|null)=>price===null?"Ask":`Rs ${price.toLocaleString("en-IN")}`;
  const isDrink=(item:FlatItem)=>drinkWords.test(`${item.item_name} ${item.category}`);
  const isSpecial=(item:FlatItem)=>specialWords.test(`${item.item_name} ${item.category} ${item.badge||""}`);
  const passes=(item:FlatItem)=>{
    const matchesQuery=!query.trim()||`${item.item_name} ${item.category} ${item.description||""}`.toLowerCase().includes(query.trim().toLowerCase());
    if(!matchesQuery)return false;
    if(filter==="value")return item.price!==null&&item.price<=100;
    if(filter==="under200")return item.price!==null&&item.price<=200;
    if(filter==="special")return isSpecial(item);
    if(filter==="drinks")return isDrink(item);
    return true;
  };
  const categories=useMemo(()=>menu.categories.map((category,ci)=>({...category,id:`category-${ci}`,items:category.items.map((item,ii)=>({...item,category:category.category_name,id:`${ci}-${ii}`})).filter(passes)})).filter(category=>category.items.length),[menu,query,filter]);
  const featured=useMemo(()=>{const marked=flat.filter(isSpecial);return (marked.length?marked:flat).slice(0,3)},[flat]);
  const recommendations=useMemo(()=>{
    const ceiling=budget==="any"?Infinity:Number(budget);
    let candidates=flat.filter(item=>item.price===null||item.price<=ceiling);
    if(mood==="signature")candidates=candidates.filter(isSpecial);
    if(mood==="refreshing")candidates=candidates.filter(isDrink);
    if(mood==="value")candidates=[...candidates].sort((a,b)=>(a.price??Infinity)-(b.price??Infinity));
    if(!candidates.length)candidates=flat.filter(item=>item.price===null||item.price<=ceiling);
    return candidates.slice(0,3);
  },[flat,mood,budget]);
  const shortlistTotal=shortlist.reduce((sum,item)=>sum+(item.price||0),0);
  const toggleShortlist=(item:FlatItem)=>setShortlist(current=>current.some(entry=>entry.id===item.id)?current.filter(entry=>entry.id!==item.id):[...current,item]);
  const selectFilter=(next:Filter)=>{setFilter(next);setQuery("")};

  return <main className="digitalMenu">
    <header className="menuIdentity">
      <div className="menuIdentityTop"><span className="menuAvatar">{initials}</span><span className="verifiedPill"><i>✓</i> Menu verified</span></div>
      <p>Explore the menu</p><h1>{businessName}</h1>
      <div className="menuMeta"><span>{total} items</span><i></i><span>Prices in {currency}</span></div>
      <button className="chooseHero" onClick={()=>setShowGuide(true)}><span><Icon name="spark"/></span><div><small>Not sure what to get?</small><strong>Let MenuSathi help you choose</strong></div><b>→</b></button>
      {(tel||wa||mapsUrl)&&<div className="venueLinks">{tel&&<a href={tel}><Icon name="phone"/>Call</a>}{wa&&<a href={wa} target="_blank" rel="noreferrer"><Icon name="whatsapp"/>WhatsApp</a>}{mapsUrl&&<a href={mapsUrl} target="_blank" rel="noreferrer"><Icon name="maps"/>Directions</a>}</div>}
    </header>

    <div className="menuTools">
      <div className="searchMenu"><Icon name="search"/><input value={query} onChange={event=>{setQuery(event.target.value);setFilter("all")}} placeholder="Search dishes or drinks" aria-label="Search menu"/>{query&&<button onClick={()=>setQuery("")} aria-label="Clear search">×</button>}</div>
      <div className="smartFilters" aria-label="Quick menu filters">{([["all","All"],["value","Under Rs 100"],["under200","Under Rs 200"],["special","Signatures"],["drinks","Drinks"]] as [Filter,string][]).map(([value,label])=><button key={value} className={filter===value?"active":""} onClick={()=>selectFilter(value)}>{label}</button>)}</div>
      {!query&&filter==="all"&&<nav className="categoryRail" aria-label="Menu categories">{menu.categories.map((category,index)=><a key={index} href={`#category-${index}`}>{category.category_name}</a>)}</nav>}
    </div>

    <div className="menuContent">
      {!query&&filter==="all"&&featured.length>0&&<section className="featuredMenu"><div className="sectionKicker"><span>Start here</span><small>House favourites</small></div><div className="featuredRail">{featured.map((item,index)=><article key={item.id} className="featuredCard"><div><span>{index===0?"Signature":"Recommended"}</span><h2>{item.item_name}</h2><p>{item.description||item.category}</p></div><footer><strong>{money(item.price)}</strong><button onClick={()=>toggleShortlist(item)} aria-label={`${shortlist.some(entry=>entry.id===item.id)?"Remove":"Add"} ${item.item_name} ${shortlist.some(entry=>entry.id===item.id)?"from":"to"} shortlist`} className={shortlist.some(entry=>entry.id===item.id)?"added":""}>{shortlist.some(entry=>entry.id===item.id)?"✓":<Icon name="plus"/>}</button></footer></article>)}</div></section>}
      {categories.length?categories.map(category=><section className="modernCategory" id={category.id} key={category.id}><div className="categoryHeading"><h2>{category.category_name}</h2><span>{category.items.length}</span></div><div className="itemList">{category.items.map(item=>{const added=shortlist.some(entry=>entry.id===item.id);return <article className="modernItem" key={item.id}><div className="itemCopy"><h3>{item.item_name}</h3>{item.description&&<p>{item.description}</p>}{(item.badge||item.portion)&&<div className="itemTags">{item.badge&&<span>{item.badge}</span>}{item.portion&&<span>{item.portion}</span>}</div>}</div><div className="itemEnd"><strong>{money(item.price)}</strong><button className={added?"added":""} onClick={()=>toggleShortlist(item)} aria-label={`${added?"Remove":"Add"} ${item.item_name} ${added?"from":"to"} shortlist`}>{added?"✓":<Icon name="plus"/>}</button></div></article>})}</div></section>):<div className="noResults"><Icon name="search"/><h2>No matching items</h2><p>Try another search or remove the filter.</p><button onClick={()=>{setQuery("");setFilter("all")}}>Show full menu</button></div>}
    </div>

    <footer className="digitalFooter"><span className="brandMark">म</span><p>Menu powered by <strong>MenuSathi</strong></p><small>Prices, ingredients and availability are managed by the restaurant.</small></footer>

    {shortlist.length>0&&<button className="shortlistBar" onClick={()=>setShowShortlist(true)}><span><Icon name="list"/><b>{shortlist.length}</b></span><div><small>Your shortlist</small><strong>{money(shortlistTotal)}</strong></div><i>View →</i></button>}

    {showGuide&&<div className="menuOverlay" onClick={()=>setShowGuide(false)}><section className="decisionSheet" role="dialog" aria-modal="true" aria-labelledby="guide-title" onClick={event=>event.stopPropagation()}><button className="sheetClose" onClick={()=>setShowGuide(false)} aria-label="Close"><Icon name="close"/></button><span className="sheetIcon"><Icon name="spark"/></span><p className="sheetEyebrow">MENUSATHI PICKS</p><h2 id="guide-title">What sounds good?</h2><p className="sheetLead">Two quick choices. No login, no waiting.</p><fieldset><legend>I feel like…</legend><div className="choiceGrid">{([["anything","Surprise me"],["signature","A signature"],["refreshing","Something refreshing"],["value","Best value"]] as const).map(([value,label])=><button key={value} className={mood===value?"active":""} onClick={()=>setMood(value)}>{label}</button>)}</div></fieldset><fieldset><legend>My budget per item</legend><div className="choiceGrid budgetChoices">{([["150","Under Rs 150"],["300","Under Rs 300"],["any","Any price"]] as const).map(([value,label])=><button key={value} className={budget===value?"active":""} onClick={()=>setBudget(value)}>{label}</button>)}</div></fieldset><div className="recommendations"><span>Try one of these</span>{recommendations.map(item=><button key={item.id} onClick={()=>toggleShortlist(item)}><div><strong>{item.item_name}</strong><small>{item.category}</small></div><b>{money(item.price)}</b><i>{shortlist.some(entry=>entry.id===item.id)?"✓":"+"}</i></button>)}</div><button className="sheetDone" onClick={()=>setShowGuide(false)}>Continue browsing</button></section></div>}

    {showShortlist&&<div className="menuOverlay" onClick={()=>setShowShortlist(false)}><section className="shortlistSheet" role="dialog" aria-modal="true" aria-labelledby="shortlist-title" onClick={event=>event.stopPropagation()}><button className="sheetClose" onClick={()=>setShowShortlist(false)} aria-label="Close"><Icon name="close"/></button><p className="sheetEyebrow">YOUR TABLE LIST</p><h2 id="shortlist-title">Show this to your waiter</h2><p className="sheetLead">This is only a shortlist. Nothing has been ordered.</p><div className="shortlistItems">{shortlist.map(item=><div key={item.id}><span><strong>{item.item_name}</strong><small>{item.category}</small></span><b>{money(item.price)}</b><button onClick={()=>toggleShortlist(item)} aria-label={`Remove ${item.item_name}`}><Icon name="close"/></button></div>)}</div><div className="shortlistTotal"><span>Estimated total</span><strong>{money(shortlistTotal)}</strong></div><button className="sheetDone" onClick={()=>setShowShortlist(false)}>Keep browsing</button><button className="clearList" onClick={()=>{setShortlist([]);setShowShortlist(false)}}>Clear shortlist</button></section></div>}
  </main>
}

