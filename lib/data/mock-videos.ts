export interface VideoItem {
    id: string;
    index: number;
    title: string;
    user: string;
    profilePhoto: string;
    description: string;
    song: string;
    likes: number;
    comments: number;
    shares: number;
    views: number;
    videoSrc: string;
    color: string;
}

const STATIC_DATA = [
    { index: 1, gender: "girl", user: "@study_sophia", title: "Library study session" },
    { index: 2, gender: "boy", user: "@tech_trent", title: "My desk setup for finals" },
    { index: 3, gender: "girl", user: "@serene_sara", title: "Sunset walk on campus" },
    { index: 4, gender: "boy", user: "@skater_brian", title: "Close call with scooter guy" },
    { index: 5, gender: "girl", user: "@motivation_mia", title: "You got this! cleaning my room" },
    { index: 6, gender: "boy", user: "@devil_fan_dan", title: "ASU WIN! LET'S GO!" },
    { index: 7, gender: "girl", user: "@commuter_cathy", title: "Commuter life reality" },
    { index: 8, gender: "boy", user: "@stadium_steve", title: "Post game crowd energy" },
    { index: 9, gender: "boy", user: "@sleepy_sam", title: "Accidentally slept until 1pm" },
    { index: 10, gender: "girl", user: "@confused_campus", title: "Why is everyone lost today" },
    { index: 11, gender: "girl", user: "@solo_sarah", title: "Group project struggles" },
    { index: 12, gender: "girl", user: "@hungry_hannah", title: "Roommate ate my food again" },
    { index: 13, gender: "boy", user: "@digital_dave", title: "Stop doomscrolling right now" },
    { index: 14, gender: "boy", user: "@mindful_mike", title: "Counseling center vibes" },
    { index: 15, gender: "girl", user: "@counselor_jen", title: "Gen Z advice from counselor" },
];

export const VIDEOS: VideoItem[] = STATIC_DATA.map((data, i) => ({
    id: `video-${i}`,
    index: i,
    title: data.title,
    user: data.user,
    profilePhoto: `/pfp/${data.index}_pfp.png`,
    description: `${data.title} #ASU #CampusLife`,
    song: "Original Sound - Campus Vibes",
    likes: Math.floor(Math.random() * 5000) + 100,
    comments: Math.floor(Math.random() * 500) + 10,
    shares: Math.floor(Math.random() * 200) + 5,
    views: Math.floor(Math.random() * 50000) + 1000,
    videoSrc: `/videos/${data.index}.mp4`,
    color: `hsl(${Math.random() * 360}, 70%, 80%)`
}));
