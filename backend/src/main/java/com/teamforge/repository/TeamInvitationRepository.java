package com.teamforge.repository;

import com.teamforge.entity.TeamInvitation;
import com.teamforge.enums.InvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamInvitationRepository extends JpaRepository<TeamInvitation, Long> {
    List<TeamInvitation> findByInviteeId(Long inviteeId);
    List<TeamInvitation> findByTeamId(Long teamId);
    List<TeamInvitation> findByInviteeIdAndStatus(Long inviteeId, InvitationStatus status);
}
