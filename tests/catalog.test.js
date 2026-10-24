import {describe,it,expect} from 'vitest';
import {helluvaEpisodes,selectEpisodes,escapeHTML} from '../catalog.js';
import {srtToVtt} from '../native-player.js';
describe('catalog',()=>{
 it('has complete first and second seasons in order',()=>{for(const [season,total] of [[1,8],[2,12]]){const items=selectEpisodes({season});expect(items).toHaveLength(total);expect(items.map(e=>e.number)).toEqual(Array.from({length:total},(_,i)=>i+1));expect(items.every(e=>/^[\w-]{11}$/.test(e.id))).toBe(true)}});
 it('combines search, season, saved and Polish filters',()=>{expect(selectEpisodes({season:2,query:'seeing'}).map(e=>e.title)).toEqual(['Seeing Stars']);expect(selectEpisodes({season:2,filter:'pl'})).toHaveLength(0);expect(selectEpisodes({season:1,filter:'pl'}).map(e=>e.number)).toEqual([1]);expect(selectEpisodes({savedOnly:true,saved:false})).toHaveLength(0);expect(selectEpisodes({savedOnly:true,saved:true})).toHaveLength(helluvaEpisodes.length)});
 it('does not pretend external entries are streamable',()=>expect(selectEpisodes({season:3}).every(e=>!e.id&&e.external.startsWith('https://www.primevideo.com/'))).toBe(true));
 it('escapes filenames and metadata',()=>expect(escapeHTML('<img onerror="x">')).toBe('&lt;img onerror=&quot;x&quot;&gt;'));
 it('converts SRT timestamps and BOM',()=>expect(srtToVtt('\uFEFF1\r\n00:00:01,250 --> 00:00:03,000\r\nTest')).toBe('WEBVTT\n\n1\n00:00:01.250 --> 00:00:03.000\nTest'));
});
