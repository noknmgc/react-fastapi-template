import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="prose lg:prose-xl">
      <h1>404 - Not Found</h1>
      <p>お探しのページは見つかりませんでした。</p>
      <Link to="/" replace>
        トップページへ戻る
      </Link>
    </div>
  );
};

export default NotFound;
