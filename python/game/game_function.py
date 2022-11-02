import sys
import pygame
from bullet import Bullet
from alien import Alien
from time import sleep


def check_events(ai_settings, status, screen, ship, scoreboard, aliens, bullets, play_button):
  for event in pygame.event.get():
    if event.type == pygame.QUIT:
      sys.exit()
    elif event.type == pygame.MOUSEBUTTONDOWN:
      mouse_x, mouse_y = pygame.mouse.get_pos()
      check_play_button(ai_settings, screen, ship, status, scoreboard, play_button, aliens, bullets, mouse_x, mouse_y)
    elif event.type == pygame.KEYDOWN:
      if event.key == pygame.K_q:
        sys.exit()
      else:
        check_keydown_events(event, ai_settings, screen, ship, bullets)
    elif event.type == pygame.KEYUP:
      check_keyup_events(event, ship)
  
# 检验是否点击了开始按钮
def check_play_button(ai_settings, screen, ship, status, scoreboard, play_button, aliens, bullets, mouse_x, mouse_y):
  button_click = play_button.rect.collidepoint(mouse_x, mouse_y)
  # 防止玩家点击按钮的位置强制开机
  if button_click and not status.game_active:
    reset_game_status(ai_settings, screen, ship, status,scoreboard, aliens, bullets)

def reset_game_status(ai_settings, screen, ship, status, scoreboard, aliens, bullets):

  # 初始化速度配置
  ai_settings.initialize_dynamic_settings()
  # 隐藏光标
  pygame.mouse.set_visible(False)
  # 重置游戏统计信息
  status.reset_status()
  status.game_active = True
  
  # 重置计分牌 & 等级
  scoreboard.prep_score()
  scoreboard.prep_high_score()
  scoreboard.prep_level()
  scoreboard.prep_ships()

  # 清空外星人和子弹列表
  aliens.empty()
  bullets.empty()
  
  create_fleet(ai_settings, screen, ship, aliens)
  ship.center_ship()
  
def check_keydown_events(event, ai_settings, screen, ship, bullets):
  if event.key == pygame.K_SPACE:
    fire_bullet(ai_settings, screen,ship, bullets)
  elif event.key == pygame.K_RIGHT:
    #向右移动飞船
    ship.moving_right = True
    ship.moving_lefe = False
  elif event.key == pygame.K_LEFT:
    #向左移动飞船
    ship.moving_right = False
    ship.moving_left = True

def check_keyup_events(event, ship):
  if event.key == pygame.K_RIGHT:
    ship.moving_right = False
  if event.key == pygame.K_LEFT:
    #向左移动飞船
    ship.moving_left = False

# 开炮
def fire_bullet(ai_settings, screen, ship, bullets):
  if len(bullets) < ai_settings.bullets_allowed:
    current_bullet = Bullet(ai_settings, screen, ship)
    bullets.add(current_bullet)

# 创建外星人群
def create_fleet(ai_settings, screen, ship, aliens):
  alien = Alien(ai_settings, screen)
  alien_width = alien.rect.width
  number_aliens_x = get_number_alien(ai_settings, alien_width)
  number_aliens_rows = get_number_rows(ai_settings, ship.rect.height, alien.rect.height)
  for row_number in range(number_aliens_rows):
    for alien_number in range(number_aliens_x):
      create_alien(ai_settings, screen, aliens, alien_number, row_number)

def get_number_alien(ai_settings, alien_width):
  available_space_x = ai_settings.screen_width - 2 * alien_width
  return int(available_space_x / (2 * alien_width))

def get_number_rows(ai_settings, ship_height, alien_height):
  available_space_y = ai_settings.screen_height - 3 * alien_height - ship_height
  number_rows = int(available_space_y / (2 * alien_height))
  return number_rows

def create_alien(ai_settings, screen, aliens, alien_number, row_number):
    alien = Alien(ai_settings, screen)
    alien_width = alien.rect.width
    alien.x = alien_width + 2 * alien_width * alien_number
    alien.rect.y = alien.rect.height + 2 * alien.rect.height * row_number
    alien.rect.x = alien.x
    aliens.add(alien)

def check_fleet_edges(ai_settings, aliens):
  for alien in aliens.sprites():
    if alien.check_edges():
      change_fleet_direction(ai_settings, aliens)
      break

def change_fleet_direction(ai_settings, aliens):
  """有个触壁整个下移，并改变方向"""
  for alien in aliens.sprites():
    alien.rect.y += ai_settings.fleet_drop_speed
  # 取反
  ai_settings.fleet_direction *= -1

# 更新外星人
def update_aliens(ai_settings, status, screen, ship, scoreboard, aliens, bullets):
  # 对编组设置update，表示每个alien设置update
  check_fleet_edges(ai_settings, aliens)
  aliens.update()

  # 检测外星人是否碰撞到底部
  check_aliens_bottom(ai_settings, status, screen, ship, scoreboard, aliens, bullets)

  # 检测外星人是否碰撞飞机
  if pygame.sprite.spritecollideany(ship, aliens):
    ship_hit(ai_settings, status, screen, ship, scoreboard, aliens, bullets)

def check_aliens_bottom(ai_settings, status, screen,  ship, scoreboard, aliens, bullets):
  screen_rect = screen.get_rect()
  for alien in aliens.sprites():
    if alien.rect.bottom >= screen_rect.bottom:
      ship_hit(ai_settings, status, screen, ship, scoreboard, aliens, bullets)
      break


def ship_hit(ai_settings, status, screen, ship, scoreboard, aliens,  bullets):
  # 飞船数量减1
  status.ships_left -= 1
  if status.ships_left > 0:
    status.ships_left -= 1
    sleep(0.5)
  else:
    status.game_active = False
    pygame.mouse.set_visible(True)

  reset_game_status(ai_settings, screen, ship, status, scoreboard,aliens, bullets)
  # 暂停
  sleep(1)

# 更新子弹
def update_bullets(ai_settings, screen, ship, status, scoreboard, aliens, bullets):
  bullets.update()
  for bullet in bullets.copy():
      if bullet.rect.bottom <= 0:
        bullets.remove(bullet)
  
  check_bullet_alien_collisions(ai_settings, screen, ship, status, scoreboard, aliens, bullets)


# 校验是否碰撞，是需要删除子弹和重新创建外星人
def check_bullet_alien_collisions(ai_settings, screen, ship, status, scoreboard, aliens, bullets):
  collisions = pygame.sprite.groupcollide(bullets, aliens, True, True)

  # 计算得分
  if collisions:
    for aliens in collisions.values():
      status.score += ai_settings.alien_points * len(aliens)
      scoreboard.prep_score()
      check_high_score(status, scoreboard)

  # 外星人为空，重新创建，外星人，清空子弹
  if len(aliens) == 0:
    bullets.empty()
    # 提高速度
    ai_settings.increase_speed()

    # 提高等级
    status.level += 1
    scoreboard.prep_level()

    # 重新创建外星人
    create_fleet(ai_settings, screen, ship, aliens)

def check_high_score(status, scoreboard):
  if status.score > status.high_score:
    status.high_score = status.score
    scoreboard.prep_high_score()

# 更新屏幕
def update_screen(ai_setting, screen, status, ship, bullets, aliens, play_button, scoreboard):
  screen.fill(ai_setting.bg_color)
  ship.blitme()
  aliens.draw(screen)

  for bullet in bullets:
    bullet.draw_bullet()

  # 显示计分牌
  scoreboard.show_score()

  if not status.game_active:
    play_button.draw_button()

  pygame.display.flip()