import { use } from "react";
import { OpinionsContext } from "../store/opinions-context";
import { useActionState } from "react";
import { useOptimistic } from "react";

export function Opinion({ opinion: { id, title, body, userName, votes } }) {
  const { upvoteOpinion, downvoteOpinion } = use(OpinionsContext);

  const [optimisticVotes, setVotesOptimistically] = useOptimistic(votes, (prevVotes, mode) => (mode === 'up' ? prevVotes + 1 : prevVotes - 1)
  );

  // useOptimistic will change the value temporary first and then update it, the tempory value will be shown to us meanwhile it will update it. If any chance update fails, like api gets intruppted and logic attached to it, will have to change value then. It will not change the value and the temporary values, previous value will be shown.

  // this is use to optimitically update the state values and there should be not much delay in updating the values

  async function upvoteAction() {
    setVotesOptimistically('up') // this will increment the state counter, smoothly
    await upvoteOpinion(id);
  }

  async function downvoteAction() {
    setVotesOptimistically('down') // this will decrement the state counter, smoothly
    await downvoteOpinion(id);
  }

  // we will face, counter increment/decrement issue if we don't do pending method as this will not hault previous execution and value wasn't able to update properly

  const [upvoteFormState, upvoteFormAction, upvotePending] = useActionState(upvoteAction);
  const [downvoteFormState, downvoteFormAction, downvotePending] = useActionState(downvoteAction)

  return (
    <article>
      <header>
        <h3>{title}</h3>
        <p>Shared by {userName}</p>
      </header>
      <p>{body}</p>
      <form className="votes">
        {/* formAction on button will act as buton action like onClick event */}
        <button formAction={upvoteFormAction} disabled={upvotePending || downvotePending}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="m16 12-4-4-4 4" />
            <path d="M12 16V8" />
          </svg>
        </button>

        {/* <span>{votes}</span> */}
        <span>{optimisticVotes}</span>

        <button formAction={downvoteFormAction} disabled={upvotePending || downvotePending}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M12 8v8" />
            <path d="m8 12 4 4 4-4" />
          </svg>
        </button>
      </form>
    </article>
  );
}
