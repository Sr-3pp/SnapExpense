export const useModal = (name: string) => {
    const isOpen = useState<boolean>(`modal-${name}-open`, () => false);

    const open = () => isOpen.value = true;

    const close = () => isOpen.value = false;

    const toggle = () => isOpen.value = !isOpen.value;

    return {
        isOpen,
        open,
        close,
        toggle
    };
}