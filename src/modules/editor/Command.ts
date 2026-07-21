export interface ICommand {
  /**
   * Executes the action and registers or applies the mutation.
   */
  execute(): void;

  /**
   * Reverts the mutation, restoring the previous state precisely.
   */
  undo(): void;

  /**
   * Name/description of the command for UI/debugging purposes.
   */
  readonly name: string;
}
