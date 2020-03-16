import fb from "./init"
import {getNumberOfVoters} from './Utility'
const db = fb.database();

const addVote = async ({roomID, selection, userID, badge}) =>{
    const rank = (badge==="influencer") ? 'voters_influencer' : 'voters_normal';
    await db.ref(`rooms/active/${roomID}/${selection}/${rank}`)
        .child(userID)
        .set(1)
        .catch(error => alert(error));
};

const incVoteCount = ({userID}) => {
    let dbRef = db.ref(`users/${userID}/meta_data/number_voted`);
    dbRef.transaction((counter) => {
        return counter? counter + 1 :1
    
    }).catch((error) => {
        console.log("incVoteCount failed: " + error.message)
    });
};


const updateVotes = async ({roomID, selection, userID, badge}) => {
    await addVote({roomID,selection,  userID,badge});
    incVoteCount({userID});

    const snapshot = await db.ref(`rooms/active/${roomID}`).once("value");

    const {numInfluencersA,numNormalA,numInfluencersB,numNormalB} = getNumberOfVoters(snapshot.val());
    const scoreA = numNormalA + 2*numInfluencersA;
    const scoreB = numNormalB + 2*numInfluencersB;

    return {
        numInfluencersA: numInfluencersA * 2,
        numNormalA: numNormalA,
        numInfluencersB: numInfluencersB * 2,
        numNormalB: numNormalB,
        scoreA: scoreA,
        scoreB: scoreB
    }
};


export default updateVotes;
