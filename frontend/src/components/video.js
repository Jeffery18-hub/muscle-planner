import { useEffect, useState } from "react";
import styled from "styled-components";

const VideoContainer = styled.div`
    max-width: 600px;
    margin: 20px auto;
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 8px;
    margin: 10px 0;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
    outline: none;

    &:focus {
        border-color: #007BFF;
    }
`;

const VideosList = styled.div`
    overflow-y: auto;
    max-height: 600px;
`;

const StyledIframe = styled.iframe`
    margin: 10px 0;
    display: block;
    max-width: 100%;
`;

const Video = ({ muscle }) => {
    const [searchItem, setSearchItem] = useState("");
    const [videoIds, setVideoIds] = useState([]);

    useEffect(() => {
        setSearchItem(muscle);
    }, [muscle]);

    useEffect(() => {
        const delay = setTimeout(() => {
            const muscleName = searchItem == null? "exercise in gym": searchItem + " exercise in gym";
            fetch(`http://localhost:5001/youtube?search_query=${muscleName}`)
                .then(response => response.json())
                .then(ids => {
                    setVideoIds(ids);
                });
        }, 300);

        return () => {
            clearTimeout(delay);
        }
    }, [searchItem]);

    const handleInputChange = (e) => {
        setSearchItem(e.target.value);
    }

    return (
        <VideoContainer>
            <div style={{ textAlign: 'center' }}>Search for videos!</div>
            <SearchInput
                type="text"
                name="search"
                value={searchItem}
                onChange={handleInputChange}
                placeholder="Search for exercise videos..."
            />
            <VideosList>
                {videoIds.map(id => (
                    <StyledIframe
                        key={id}
                        width="560"
                        height="315"
                        src={`https://www.youtube.com/embed/${id}`}
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ))}
            </VideosList>
        </VideoContainer>
    )
}

export default Video;
