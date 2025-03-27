import AuthForm from "@/components/AuthForm";

export default function SignIn() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Account Access</h1>
      <AuthForm />
    </div>
  );
}
