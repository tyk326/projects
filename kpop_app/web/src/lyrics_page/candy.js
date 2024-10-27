import React from 'react';
import './candy.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


const candy = () => {
    return (
        <div>
            <div className='candy_song_info'>
                <h1>Candy</h1>
                <p>by Seventeen</p>
            </div>
            <div className='candy_lyrics'>
                <div className='candy_multiblocks'>
                    <div className='candy_block candy_block1'>
                        <p>[Intro: Joshua]</p>
                        <p>우리 사탕 같은 사랑해요</p>
                        <p>자그만 말 하나에도</p>
                        <p>기분이 좋아질 수 있게요</p>
                    </div>
                    <div className='candy_block candy_block2'>
                        <p>[Verse: DK, Jeonghan, Seungkwan]</p>
                        <p>사랑 같은 건 아마 원래 쓰디쓴 걸까요</p>
                        <p>나는 싫어요 어쩌죠?</p>
                        <p>어른이 되는 것 만큼 사랑도 힘든 걸요</p>
                        <p>그러나 그치만 그래도</p>
                    </div>
                </div>
                <div className='candy_multiblocks'>
                    <div className='candy_block candy_block3'>
                        <p>[Chorus: Woozi, Joshua, Jeonghan]</p>
                        <p>우리 사탕 같은 사랑해요</p>
                        <p>자그만 말 하나에도</p>
                        <p>기분이 좋아질 수 있게요</p>
                        <p>우리 사탕 같은 사랑하며</p>
                        <p>사르르 녹아질래요? 어때요?</p>
                        <p>그대 맘을 다 가지고 싶다면 어린 맘인가요</p>
                    </div>
                    <div className='candy_block candy_block4'>
                        <p>[Chorus: Seungkwan, DK, Woozi]</p>
                        <p>우리 사탕 같은 사랑해요</p>
                        <p>상처 뿐인 하루라도</p>
                        <p>한번은 웃을 수 있게요</p>
                        <p>우리 사탕 같은 사랑하며</p>
                        <p>사르르 녹아질래요? 어때요?</p>
                        <p>그대 맘을 다 가지고</p>
                        <p>싶다면 어린 맘인가요</p>
                    </div>
                </div>
            </div>
            <p className='candy_return_link'><span style={{ fontSize: '12px' }}><Link to="/" style={{ textDecoration: 'none' }}>---{'>'} Return to main page</Link></span></p>
        </div>
    );
};

export default candy;