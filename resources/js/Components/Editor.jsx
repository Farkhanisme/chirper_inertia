import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm } from "@inertiajs/react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css"; // Tambahkan CSS untuk tema snow

export default () => {
    const { data, setData, post, processing, reset, errors } = useForm({
        message: "",
        hashtags: [],
        media: null,
    });
    const [preview, setPreview] = useState(null);
    const { quill, quillRef } = useQuill({
        placeholder: "What's on your mind?",
        modules: {
            toolbar: [
                ["bold", "italic", "underline", "strike"],
                [{ align: [] }],

                [{ list: "ordered" }, { list: "bullet" }],
                // [{ indent: "-1" }, { indent: "+1" }],

                [{ size: ["small", false, "large", "huge"] }],
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                ["image", "video"],
                // [{ color: [] }, { background: [] }],
            ],
        },
    });

    const selectLocalImage = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = () => {
            const file = input.files[0];
            setData((prevData) => ({
                ...prevData,
                media: file,
            }));

            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    setPreview(reader.result);
                };
                reader.readAsDataURL(file);
            }
        };
    };

    const extractHashtags = (text) => {
        const hashtagRegex = /#(\w+)/g;
        const foundHashtags = text.match(hashtagRegex) || [];
        return foundHashtags.map((tag) => tag.slice(1));
    };

    React.useEffect(() => {
        if (quill) {
            quill.getModule("toolbar").addHandler("image", selectLocalImage);
            quill.on("text-change", (delta, oldDelta, source) => {
                const htmlContent = quill.root.innerHTML;
                const textContent = quill.getText();
                setData((prevData) => ({
                    ...prevData,
                    message: htmlContent,
                    hashtags: extractHashtags(textContent),
                }));
            });
        }
    }, [quill]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(data.message, data.media);

        const formData = new FormData();
        formData.append("message", data.message);
        formData.append("hashtags", JSON.stringify(data.hashtags));

        if (data.media) {
            formData.append("media", data.media);
        }

        Inertia.post(route("chirps.store"), formData, {
            forceFormData: true,
            // preserveState: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mb-6 bg-white shadow rounded-lg p-4"
        >
            <div className="w-full h-fit">
                <div ref={quillRef} />

                {data.hashtags.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                        Hashtags:{" "}
                        {data.hashtags.map((tag) => `#${tag}`).join(", ")}
                    </div>
                )}
                {preview && (
                    <div className="mt-4">
                        <p className="text-sm text-gray-600">Image Preview:</p>
                        <img
                            src={preview}
                            alt="Preview"
                            className="mt-2 max-w-full h-auto border rounded"
                        />
                    </div>
                )}
                <div className="mt-4 flex justify-between items-center">
                    <InputError message={errors.media} className="mt-2" />
                    <PrimaryButton className="mt-4" disabled={processing}>
                        Chirp
                    </PrimaryButton>
                </div>
            </div>
        </form>
    );
};
