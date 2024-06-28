import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="prose mx-auto mt-8 max-w-screen-md lg:prose-xl lg:max-w-screen-lg">
      <h1>404 - Not Found</h1>
      <p>お探しのページは見つかりませんでした。</p>
      <Link to="/" replace>
        トップページへ戻る
      </Link>
    </div>
  );
};

export default NotFound;
