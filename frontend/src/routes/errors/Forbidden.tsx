import { Link } from "react-router-dom";

const Forbidden: React.FC = () => {
  return (
    <div className="prose mx-auto mt-8 max-w-screen-md lg:prose-xl lg:max-w-screen-lg">
      <h1>403 - Forbidden</h1>
      <p>アクセスしようとしたページは、表示できません。</p>
      <Link to="/" replace>
        トップページへ戻る
      </Link>
    </div>
  );
};

export default Forbidden;
