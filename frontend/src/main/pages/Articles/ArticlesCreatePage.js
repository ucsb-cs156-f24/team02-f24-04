import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import ArticlesForm from "main/components/Articles/ArticlesForm";
import { Navigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function ArticlesCreatePage({ storybook = false }) {
  const objectToAxiosParams = (sbarticle) => ({
    url: "/api/articles/post",
    method: "POST",
    params: {
      title: sbarticle.title,
      url: sbarticle.url,
      explanation: sbarticle.explanation,
      email: sbarticle.email,
      dateAdded: sbarticle.dateAdded,
    },
  });

  const onSuccess = (sbarticle) => {
    toast(
      `New article Created - id: ${sbarticle.id} title: ${sbarticle.title}`
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/articles/all"]
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/articles" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Article</h1>

        <ArticlesForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}
