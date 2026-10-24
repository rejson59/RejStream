// @vitest-environment jsdom
import {it,expect,vi,beforeAll} from 'vitest';
beforeAll(async()=>{
 document.body.innerHTML='<div id="app"></div>';
 vi.spyOn(HTMLMediaElement.prototype,'pause').mockImplementation(()=>{});
 vi.spyOn(HTMLMediaElement.prototype,'load').mockImplementation(()=>{});
 await import('../src.js');
});
it('renders season 1 and switches to all 12 season 2 episodes',()=>{
 expect(document.querySelectorAll('[data-ep]')).toHaveLength(8);
 const select=document.querySelector('#season');select.value='2';select.dispatchEvent(new Event('change'));
 expect(document.querySelectorAll('[data-ep]')).toHaveLength(12);
});
it('keeps Polish filter applied through searches, and resets empty state',()=>{
 document.querySelector('[data-filter="pl"]').click();expect(document.querySelectorAll('[data-ep]')).toHaveLength(0);
 const input=document.querySelector('#search');input.value='missing title';input.dispatchEvent(new Event('input'));
 expect(document.querySelector('#empty').classList.contains('hidden')).toBe(false);
 document.querySelector('#reset').click();expect(document.querySelectorAll('[data-ep]')).toHaveLength(8);
});
it('shows actual Polish source for first episode',()=>{
 document.querySelector('[data-ep="0"]').click();const audio=document.querySelector('#audio');audio.value='pl';audio.dispatchEvent(new Event('change'));expect(document.querySelector('iframe').src).toContain('4DjfKP5w8Ps');document.querySelector('.close').click();expect(document.querySelector('iframe')).toBeNull();
});
it('opens external-only season without a fake player',()=>{
 const select=document.querySelector('#season');select.value='3';select.dispatchEvent(new Event('change'));
 document.querySelector('[data-ep]').click();expect(document.querySelector('#modal iframe')).toBeNull();expect(document.querySelector('#modal a').href).toContain('primevideo.com');document.querySelector('.close').click();
});
it('opens local player with captions, without upload or iframe',()=>{
 document.querySelector('#open-local').click();expect(document.querySelector('#modal video')).not.toBeNull();expect(document.querySelector('#modal iframe')).toBeNull();expect(document.querySelector('.local-subs').accept).toBe('.vtt,.srt');expect(document.querySelector('.local-video')).not.toBeNull();document.querySelector('.close').click();expect(document.querySelector('video')).toBeNull();
});
it('movies tab includes native film, not series',()=>{
 document.querySelector('[data-nav="movies"]').click();expect(document.querySelectorAll('[data-ep]')).toHaveLength(0);expect(document.querySelectorAll('[data-extra]')).toHaveLength(1);document.querySelector('[data-extra="bunny"]').click();expect(document.querySelector('video').src).toContain('BigBuckBunny.mp4');expect(document.querySelector('#modal').textContent).toContain('CC BY 3.0');document.querySelector('.close').click();
});
