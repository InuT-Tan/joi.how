import { GameEvent } from '../../../types'
import { GameBoardActions } from '../../../store'
import { MessageType } from '../../../MessageArea/MessageTypes'

export const unlock: GameEvent = () => {
  return async (state, dispatch) => {
    let release = state.settings.player.release
    dispatch(GameBoardActions.PauseEvents())
    dispatch(GameBoardActions.PauseGame())
    dispatch(
      GameBoardActions.ShowMessage({
        type: MessageType.Prompt,
        text: `You can unlock yourself, $player.\n \
            Remember, your $part is mine untill ${release.getMonth()}/${release.getDate()}.`,
        buttons: [
          {
            display: `Yes $master`,
            method: async () => {
              dispatch(GameBoardActions.ResumeEvents())
              dispatch(GameBoardActions.ResumeGame())
            },
          },
        ],
      }),
    )
  }
}

export const chastityGamble: GameEvent = () => {
  return async (state, dispatch) => {
    let days = Math.floor(Math.random() * (10 - 1 + 1) + 1)
    let release = state.settings.player.release
    dispatch(GameBoardActions.PauseEvents())
    dispatch(GameBoardActions.PauseGame())
    dispatch(
      GameBoardActions.ShowMessage({
        type: MessageType.Prompt,
        text: `Roll for +/-${days} days ${chasteMsg()}, $player?\n \
            Current Release: ${release}`,
        buttons: [
          {
            display: `Yes $master`,
            method: () => {
              let message
              if (Math.random() > 0.5) {
                message = `+${days} ${chasteMsg()}`
              } else {
                message = `-${days} ${chasteMsg()}`
                days = days - days * 2
              }
              dispatch(
                GameBoardActions.ShowMessage({
                  type: MessageType.NewEvent,
                  text: `Good $player, ${message} days ${chasteMsg()}`,
                }),
              )
              dispatch(GameBoardActions.SetRelease(new Date(state.settings.player.release.getDate() + days)))
              dispatch(GameBoardActions.ResumeEvents())
              dispatch(GameBoardActions.ResumeGame())
            },
          },
          {
            display: `No $master`,
            method: () => {
              if (Math.random() < 0.1) {
                dispatch(
                  GameBoardActions.ShowMessage({
                    type: MessageType.NewEvent,
                    text: `Wrong answer $player, +${days} more days ${chasteMsg()}`,
                  }),
                )
              } else {
                dispatch(
                  GameBoardActions.ShowMessage({
                    type: MessageType.NewEvent,
                    text: `Your loss, $player`,
                  }),
                )
              }
              dispatch(GameBoardActions.ResumeGame())
              dispatch(GameBoardActions.ResumeEvents())
            },
          },
        ],
      }),
    )
  }
}

function chasteMsg() {
  const rand = Math.random()
  switch (true) {
    case rand < 0.25:
      return 'locked away'
    case rand < 0.5:
      return 'in chastity'
    case rand < 0.75:
      return 'caged up'
    case rand < 1:
      return 'pent up'
    default:
      return 'bug, report me please'
  }
}
