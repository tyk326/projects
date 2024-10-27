import React from 'react';
import './lmf.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


const lmf = () => {
    return (
        <div>
            <div className='lmf_song_info'>
                <h1>Love, Money, Fame</h1>
                <p>by Seventeen</p>
            </div>
            <div className='lmf_lyrics'>
                <div className='lmf_multiblocks'>
                    <div className='lmf_block lmf_block1'>
                        <p><b>[Intro: DJ Khaled]</b></p>
                        <p>We The Best Music</p>
                        <p>Another one</p>
                        <p>DJ Khaled</p>
                    </div>
                    <div className='lmf_block lmf_block2'>
                        <p><b>[Chorus: Woozi, Joshua, Jeonghan]</b></p>
                        <p>I never before in my lifetime</p>
                        <p>이런 나의 마음 말로</p>
                        <p>못해서 준비해 봤어 primetime</p>
                        <p>'Cause you changin' me for better</p>
                        <p>You're the reason for my being</p>
                        <p>나를 숨 쉬게 하니까</p>
                        <p>Oh, baby, it's all up to you</p>
                        <p>영원히 나만의 GOAT (Yeah, yeah)</p>
                    </div>
                    <div className='lmf_block lmf_block3'>
                        <p><b>[Pre - Chorus: Dino, Hoshi]</b></p>
                        <p>사랑의 많은 paradigm</p>
                        <p>널 헷갈리게 하지 않아</p>
                        <p>You know what I need is only you</p>
                        <p>Ah, yeah, yeah, yeah, yeah</p>
                        <p>사랑이란 확신의 말</p>
                        <p>거짓 없이 눈 맞춰 봐</p>
                        <p>Just trust me once, baby</p>
                        <p>I'll never let you down, baby</p>
                    </div>
                    <div className='lmf_block lmf_block4'>
                        <p><b>[Chorus: S.Coups, DK]</b></p>
                        <p>모두가 원해 (Hey)</p>
                        <p>사랑 돈 명예 (Ho)</p>
                        <p>But only want you, baby, baby, baby</p>
                        <p>I only want you, baby, baby, baby</p>
                        <p>너 없이 빛나는 fame</p>
                        <p>나는 원하지 않아</p>
                        <p>너의 사랑 하나 그거면 돼</p>
                        <p>Baby, baby, yeah, baby, baby, yeah</p>
                    </div>
                </div>
                <div className='lmf_multiblocks'>
                    <div className='lmf_block lmf_block5'>
                        <p><b>[Verse 2: Vernon, Mingyu]</b></p>
                        <p>Poppin', 시간은 금이니까?</p>
                        <p>바삐 너에게 뛰는 심장이 main topic</p>
                        <p>I can solve your problem, 그게 나답지</p>
                        <p>Time together, 녹지 않는 나의 ice cream</p>
                        <p>가끔 널 잃을까 봐 겁나</p>
                        <p>그 날이 오면 난 이룬 게 뭘까? Yeah</p>
                        <p>Fame, money, love, 세 개는 많아</p>
                        <p>Only last one, 내가 바란 하나</p>
                    </div>
                    <div className='lmf_block lmf_block6'>
                        <p><b>[Pre-Chorus: The8, Woozi]</b></p>
                        <p>사랑의 많은 paradigm</p>
                        <p>널 헷갈리게 하지 않아</p>
                        <p>You know what I need is only you</p>
                        <p>Ah, yeah, yeah, yeah, yeah</p>
                        <p>사랑이란 확신의 말</p>
                        <p>거짓 없이 눈 맞춰 봐</p>
                        <p>Just trust me once, baby</p>
                        <p>I'll never let you down, baby</p>
                    </div>
                    <div className='lmf_block lmf_block7'>
                        <p><b>[Pre-Chorus: The8, Woozi]</b></p>
                        <p>모두가 원해 (Hey)</p>
                        <p>사랑 돈 명예 (Ho)</p>
                        <p>But only want you, baby, baby, baby</p>
                        <p>I only want you, baby, baby, baby</p>
                        <p>너 없이 빛나는 fame</p>
                        <p>나는 원하지 않아</p>
                        <p>너의 사랑 하나 그거면 돼</p>
                        <p>Baby, baby, yeah, baby, baby, yeah</p>
                    </div>
                </div>
                <div className='lmf_multiblocks'>
                    <div className='lmf_block lmf_block8'>
                        <p><b>[Bridge: Jeonghan]</b></p>
                        <p>사랑을 할 때, I don't need something</p>
                        <p>내 마음은 그래, 너에게</p>
                        <p>너만 있어 주면, I don't need something</p>
                        <p>내 마음은 그래, 너에게</p>
                    </div>
                    <div className='lmf_block lmf_block9'>
                        <p><b>[Bridge: Jeonghan]</b></p>
                        <p>모두가 원해 (Hey)</p>
                        <p>사랑 돈 명예 (Ho)</p>
                        <p>But only want you, baby, baby, baby</p>
                        <p>I only want you, baby, baby, baby</p>
                        <p>너 없이 빛나는 fame</p>
                        <p>나는 원하지 않아</p>
                        <p>너의 사랑 하나 그거면 돼</p>
                        <p>Baby, baby, yeah, baby, baby, yeah</p>
                    </div>
                    <div className='lmf_block lmf_block10'>
                        <p><b>[Outro: DJ Khaled]</b></p>
                        <p>Yeah, SEVENTEEN</p>
                        <p>DJ Khaled</p>
                        <p>Another one</p>
                    </div>
                </div>
            </div>
            <p className='lmf_return_link'><span style={{ fontSize: '12px' }}><Link to="/" style={{ textDecoration: 'none' }}>---{'>'} Return to main page</Link></span></p>
        </div>
    );
};

export default lmf;